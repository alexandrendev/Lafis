import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { Simulation } from '../../entity/Simulation';
import { InfoItemComponent } from '../../components/info-item/info-item.component';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api/api.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartProviderService } from '../../service/chart/chart-provider.service';
import { TranslationServiceService } from '../../service/helpers/translation-service.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PreviewSchema, ThreeServiceService } from '../../service/three-service.service';

@Component({
  selector: 'app-simulation-report',
  imports: [InfoItemComponent, CommonModule, BaseChartDirective, RouterLink],
  templateUrl: './simulation-report.component.html',
  styleUrl: './simulation-report.component.scss'
})
export class SimulationReportComponent implements OnInit, AfterViewInit, OnDestroy {
  simulation!: Simulation;
  chartOptions;
  chartData;
  public pieChartType: ChartType = 'pie';
  solidAngle!: number;
  error!: number;
  escapedPercent!: number;
  emissionsPerSecond!: number;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private previewGroup = new THREE.Group();
  private staticHelpers = new THREE.Group();
  private animationFrameId?: number;
  private resizeObserver?: ResizeObserver;
  private isUserInteracting = false;
  private viewInitialized = false;
  private threeInitAttempts = 0;
  private readonly maxThreeInitAttempts = 20;

  private readonly api = inject(ApiService);

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private chart: ChartProviderService,
    private threeService: ThreeServiceService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public translationService: TranslationServiceService,
  ) {

    this.chartOptions = this.chart.chartOptions;
    this.chartData = this.chart.chartData;
  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.findById(id).subscribe({
        next: (simulation: Simulation) => {
          this.simulation = simulation;
          if (this.hasResults) {
            this.updateCharts();
          }
          this.threeInitAttempts = 0;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.ensureThreeInitialized();
          }, 100);
        },
        error: (error: any) => {
          console.error('Erro ao carregar simulação:', error);
        }
      });
    } else {
      console.error('ID da simulação não encontrado na URL.');
    }
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.ensureThreeInitialized();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.controls?.dispose();
    this.renderer?.dispose();
    this.resizeObserver?.disconnect();
  }

  get apertureType(): string | undefined {
    return this.simulation?.apertureType?.toLowerCase() ?? this.simulation?.context?.aperture?.type;
  }

  get hasResults(): boolean {
    return this.simulation?.status === 'FINISHED';
  }

  get sourceType(): string | undefined {
    return this.simulation?.sourceType?.toLowerCase() ?? this.simulation?.context?.source?.type;
  }

  get pointCenterX(): number | undefined {
    const source = this.simulation?.context?.source as any;
    return source?.centerX ?? source?.x;
  }

  get pointCenterY(): number | undefined {
    const source = this.simulation?.context?.source as any;
    return source?.centerY ?? source?.y;
  }

  get pointCenterZ(): number | undefined {
    const source = this.simulation?.context?.source as any;
    return source?.centerZ ?? source?.z;
  }

  get apertureHeight(): number {
    return this.simulation.context?.aperture?.height ?? 0;
  }

  get apertureWidth(): number {
    return this.simulation.context?.aperture?.width ?? 0;
  }

  get apertureDepth(): number {
    return this.simulation.context?.aperture?.depth ?? 0;
  }

  get apertureRadius(): number {
    return this.simulation.context?.aperture?.radius ?? 0;
  }

  get sourceHeightValue(): number {
    return this.simulation.context?.source?.height ?? 0;
  }

  get sourceWidthValue(): number {
    return this.simulation.context?.source?.width ?? 0;
  }

  get sourceDepthValue(): number {
    return this.simulation.context?.source?.depth ?? 0;
  }

  get sourceRadiusValue(): number {
    return this.simulation.context?.source?.radius ?? 0;
  }

  get simulationDuration(): string {
    return this.simulation?.duration ?? '-';
  }

  get solidAngleInPi(): number {
    return this.solidAngle / Math.PI;
  }

  private updateCharts(): void {
    const { escaped, emissions } = this.simulation;
    this.chart.updateChartData(escaped, emissions);

    this.chartData = { ...this.chart.chartData };

    this.solidAngle = this.simulation.solidAngle ?? 0;
    this.error = this.simulation.solidAngleError ?? 0;
    this.escapedPercent = (this.simulation.escaped / this.simulation.emissions) * 100;

    const seconds = this.extractTotalSeconds(this.simulation.duration);
    this.emissionsPerSecond = seconds > 0 ? this.simulation.emissions / seconds : 0;

  }

  private extractTotalSeconds(timeStr: string): number {
    const regex = /(\d+)\s*min\s*(\d+)\s*sec\s*(\d+)\s*ms/;
    const matches = timeStr.match(regex);
  
    if (matches) {
      const minutes = parseInt(matches[1], 10);
      const seconds = parseInt(matches[2], 10);
      const milliseconds = parseInt(matches[3], 10);
  
      const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;
      return totalSeconds;
    } else {
      throw new Error('Formato de tempo inválido');
    }
  }

  printReport() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.body.classList.add('printing-report');
    requestAnimationFrame(() => setTimeout(() => window.print(), 100));
  }

  @HostListener('window:afterprint')
  onAfterPrint(): void {
    document.body.classList.remove('printing-report');
  }

  resetCameraView(): void {
    this.isUserInteracting = false;
    this.fitCameraToPreview();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeRendererToContainer();
  }

  private initThree(): void {
    const container = this.el.nativeElement.querySelector('.threejs-container');
    if (!container) {
      console.log('Container not found, scheduling retry');
      this.scheduleThreeRetry();
      return;
    }

    if (container.clientWidth <= 0 || container.clientHeight <= 0) {
      console.log('Container has no dimensions, scheduling retry');
      this.scheduleThreeRetry();
      return;
    }

    console.log('Initializing Three.js with container size:', container.clientWidth, 'x', container.clientHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#f3f5f7');
    this.scene.add(this.previewGroup);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.touchAction = 'none';
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      5000
    );
    this.camera.position.set(20, 20, 20);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = true;
    this.controls.panSpeed = 1.2;
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 1.1;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 2500;
    this.controls.target.set(0, 2, 0);
    this.controls.update();
    this.controls.addEventListener('start', () => {
      this.isUserInteracting = true;
    });

    console.log('Three.js initialized, adding helpers and starting animation');
    this.addStaticSceneHelpers();
    this.observeContainerResize(container);
    this.resizeRendererToContainer();
    this.animate();
    
    console.log('Calling updateSimulationPreview from initThree');
    this.updateSimulationPreview();
  }

  private ensureThreeInitialized(): void {
    if (!isPlatformBrowser(this.platformId) || !this.viewInitialized || !this.simulation || this.renderer) {
      return;
    }
    this.scheduleThreeRetry();
  }

  private scheduleThreeRetry(): void {
    if (this.renderer || this.threeInitAttempts >= this.maxThreeInitAttempts) {
      return;
    }

    this.threeInitAttempts += 1;
    requestAnimationFrame(() => this.initThree());
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private observeContainerResize(container: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId) || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeRendererToContainer();
    });
    this.resizeObserver.observe(container);
  }

  private addStaticSceneHelpers(): void {
    this.staticHelpers.clear();

    const gridHelper = new THREE.GridHelper(200, 40, 0x7f8c8d, 0xbdc3c7);
    const axesHelper = new THREE.AxesHelper(12);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(20, 25, 15);
    directionalLight.castShadow = true;

    this.staticHelpers.add(gridHelper);
    this.staticHelpers.add(axesHelper);
    this.staticHelpers.add(ambientLight);
    this.staticHelpers.add(directionalLight);
    this.scene.add(this.staticHelpers);
  }

  private updateSimulationPreview(): void {
    if (!this.simulation || !this.viewInitialized) {
      console.log('Preview skipped: simulation or view not ready');
      return;
    }

    if (!this.renderer) {
      console.log('Preview skipped: renderer not initialized yet');
      return;
    }

    console.log('Rendering preview with schema:', {
      apertureType: this.apertureType,
      sourceType: this.sourceType,
      previewGroupChildren: this.previewGroup.children.length
    });

    const schema: PreviewSchema = {
      apertureType: this.apertureType,
      sourceType: this.sourceType,
      apertureHeight: this.apertureHeight,
      apertureWidth: this.apertureWidth,
      apertureDepth: this.apertureDepth,
      apertureRadius: this.apertureRadius,
      sourceHeight: this.sourceHeightValue,
      sourceWidth: this.sourceWidthValue,
      sourceDepth: this.sourceDepthValue,
      sourceRadius: this.sourceRadiusValue,
      sourceCenterX: this.pointCenterX,
      sourceCenterY: this.pointCenterY,
      sourceCenterZ: this.pointCenterZ
    };
    
    this.threeService.renderPreviewFromSchema(this.previewGroup, schema);
    
    console.log('After render, previewGroup children:', this.previewGroup.children.length);

    if (!this.isUserInteracting) {
      this.fitCameraToPreview();
    }
  }

  private fitCameraToPreview(): void {
    if (!this.camera || !this.controls) {
      return;
    }

    if (this.previewGroup.children.length === 0) {
      this.camera.position.set(20, 20, 20);
      this.controls.target.set(0, 2, 0);
      this.controls.update();
      return;
    }

    const box = new THREE.Box3().setFromObject(this.previewGroup);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    if (![size.x, size.y, size.z, center.x, center.y, center.z].every(Number.isFinite)) {
      this.camera.position.set(20, 20, 20);
      this.controls.target.set(0, 2, 0);
      this.controls.update();
      return;
    }

    const maxSize = Math.max(size.x, size.y, size.z, 1);
    const fitHeightDistance = maxSize / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)));
    const fitWidthDistance = fitHeightDistance / this.camera.aspect;
    const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance);

    const direction = new THREE.Vector3(1, 1, 1).normalize();
    this.camera.position.copy(center).add(direction.multiplyScalar(distance));
    this.camera.near = Math.max(distance / 100, 0.1);
    this.camera.far = Math.max(distance * 10, 1000);
    this.camera.updateProjectionMatrix();

    this.controls.target.copy(center);
    this.controls.maxDistance = Math.max(distance * 8, 200);
    this.controls.update();
  }

  private resizeRendererToContainer(): void {
    if (!isPlatformBrowser(this.platformId) || !this.renderer || !this.camera) {
      return;
    }

    const container = this.el.nativeElement.querySelector('.threejs-container');
    if (!container) {
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width <= 0 || height <= 0) {
      return;
    }

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

}
