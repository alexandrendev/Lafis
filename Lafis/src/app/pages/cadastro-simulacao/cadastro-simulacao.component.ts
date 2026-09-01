import { Component, OnInit, AfterViewInit, ElementRef, HostListener, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, Validators, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PreviewSchema, ThreeServiceService } from '../../service/three-service.service';
import { ApiService } from '../../service/api/api.service';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';

interface NumericFormValues {
  emissions: number;
  apertureZAxisHeight: number;
  apertureRadius: number;
  apertureHeight: number;
  apertureWidth: number;
  prismHeight: number;
  prismWidth: number;
  prismDepth: number;
  sphereRadius: number;
  cylinderHeight: number;
  cylinderRadius: number;
  sourceCenterX: number;
  sourceCenterY: number;
  sourceCenterZ: number;
}

@Component({
  selector: 'app-cadastro-simulacao',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-simulacao.component.html',
  styleUrls: ['./cadastro-simulacao.component.scss']
})
export class CadastroSimulacaoComponent implements OnInit, AfterViewInit, OnDestroy {
  form!: FormGroup;
  currentStep = 1;
  readonly steps = [
    { number: 1, title: 'Abertura', description: 'Emissões e geometria do poço' },
    { number: 2, title: 'Fonte', description: 'Tipo, posição e dimensões' },
    { number: 3, title: 'Revisão', description: 'Confira e crie a simulação' }
  ];

  private readonly positiveDecimalValidator = this.decimalValidator(false, false);
  private readonly signedDecimalValidator = this.decimalValidator(true, true);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private previewGroup = new THREE.Group();
  private staticHelpers = new THREE.Group();
  private animationFrameId?: number;
  private resizeObserver?: ResizeObserver;
  private isUserInteracting = false;

  constructor(
    private el: ElementRef, 
    private service: ThreeServiceService, 
    private apiService: ApiService, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.scene = new THREE.Scene();

    this.form = new FormGroup({
      name: new FormControl<string>('', [Validators.required, Validators.maxLength(80)]),
      emissions: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      apertureType: new FormControl<string>('', Validators.required),
      apertureZAxisHeight: new FormControl<number | string>(0, [Validators.required, this.positiveDecimalValidator]),
      apertureRadius: new FormControl<number | string>(0, [Validators.required, this.positiveDecimalValidator]),
      apertureHeight: new FormControl<number | string>(0, [Validators.required, this.positiveDecimalValidator]),
      apertureWidth: new FormControl<number | string>(0, [Validators.required, this.positiveDecimalValidator]),
      sourceType: new FormControl<string>('', Validators.required),
      prismHeight: new FormControl<number | string>(0, [Validators.required, this.positiveDecimalValidator]),
      prismWidth: new FormControl<number | string>(0, [Validators.required, this.positiveDecimalValidator]),
      prismDepth: new FormControl<number | string>(0, [Validators.required, this.positiveDecimalValidator]),
      sphereRadius: new FormControl<number | string>(0, [Validators.required, this.positiveDecimalValidator]),
      cylinderHeight: new FormControl<number | string>(0, [Validators.required, this.positiveDecimalValidator]),
      cylinderRadius: new FormControl<number | string>(0, [Validators.required, this.positiveDecimalValidator]),
      sourceCenterX: new FormControl<number | string>(0, [Validators.required, this.signedDecimalValidator]),
      sourceCenterY: new FormControl<number | string>(0, [Validators.required, this.signedDecimalValidator]),
      sourceCenterZ: new FormControl<number | string>(0, [Validators.required, this.signedDecimalValidator])
    });


    this.form.get('apertureType')?.valueChanges.subscribe(value => {
      this.updateApertureFields(value);
    });

    this.form.get('sourceType')?.valueChanges.subscribe(value => {
      this.updateSourceFields(value);
    });

    this.form.valueChanges.subscribe(() => {
      if (isPlatformBrowser(this.platformId) && this.renderer) {
        this.updateScene();
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const values = this.getNumericFormValues();
    let aperture: any;
    let sourceType;
    let apertureType;
    if (this.form.get('apertureType')?.value === 'circular') {
      aperture = {
        type: 'circular',
        radius: values.apertureRadius,
        height: values.apertureZAxisHeight
      };
      apertureType = 'CIRCULAR';
    } else if (this.form.get('apertureType')?.value === 'rectangular') {
      aperture = {
        type: 'rectangular',
        width: values.apertureWidth,
        height: values.apertureZAxisHeight,
        depth: values.apertureHeight
      };
      apertureType = 'RECTANGULAR';
    }
  
    let source: any;
    if (this.form.get('sourceType')?.value === 'prismatica') {
      source = {
        type: 'cuboid',
        height: values.prismHeight,
        width: values.prismWidth,
        depth: values.prismDepth,
        centerX: values.sourceCenterX,
        centerY: values.sourceCenterY,
        centerZ: values.sourceCenterZ
      };
      sourceType = 'CUBOID';
    } else if (this.form.get('sourceType')?.value === 'esferica') {
      source = {
        type: 'spherical',
        radius: values.sphereRadius,
        centerX: values.sourceCenterX,
        centerY: values.sourceCenterY,
        centerZ: values.sourceCenterZ
      };
      sourceType = 'SPHERICAL'
    } else if (this.form.get('sourceType')?.value === 'cilindrica') {
      source = {
        type: 'cylindrical',
        height: values.cylinderHeight,
        radius: values.cylinderRadius,
        centerX: values.sourceCenterX,
        centerY: values.sourceCenterY,
        centerZ: values.sourceCenterZ
      };
      sourceType = 'CYLINDRICAL';
    } else if (this.form.get('sourceType')?.value === 'pontual') {
      source = {
        type: 'point',
        centerX: values.sourceCenterX,
        centerY: values.sourceCenterY,
        centerZ: values.sourceCenterZ
      };
      sourceType = 'POINT';
    }
    const request = {
      name: this.form.get('name')?.value?.trim(),
      emissions: values.emissions,
      sourceHeight: values.sourceCenterZ,
      apertureType: apertureType,
      aperture: aperture,
      sourceType: sourceType,
      source: source
    };
 
    console.log('apertureZAxisHeight:', this.form.get('apertureZAxisHeight')?.value);

    this.apiService.createNewContext(request).subscribe({
      next: () => {
        this.notificationService.showAlert('Simulação criada com sucesso!', () => {
          this.router.navigate(['/all']);
        });
      },
      error: (err) => {
        console.error('Erro ao criar simulação:', err);
        this.notificationService.showAlert('Falha ao criar simulação');
      }
    });
  }

  nextStep(): void {
    if (!this.isStepValid(this.currentStep)) {
      this.markStepAsTouched(this.currentStep);
      return;
    }
    this.currentStep = Math.min(this.currentStep + 1, this.steps.length);
  }

  previousStep(): void {
    this.currentStep = Math.max(this.currentStep - 1, 1);
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.isStepCompleted(step - 1)) {
      this.currentStep = step;
    }
  }

  isStepCompleted(step: number): boolean {
    return step < this.currentStep && this.isStepValid(step);
  }

  isStepValid(step: number): boolean {
    const controls = step === 1 ? this.apertureControls() : this.sourceControls();
    return controls.every(control => this.form.get(control)?.valid);
  }

  apertureControls(): string[] {
    const controls = ['name', 'emissions', 'apertureType', 'apertureZAxisHeight'];
    return this.form.get('apertureType')?.value === 'circular'
      ? [...controls, 'apertureRadius']
      : [...controls, 'apertureHeight', 'apertureWidth'];
  }

  sourceControls(): string[] {
    const controls = ['sourceType', 'sourceCenterX', 'sourceCenterY', 'sourceCenterZ'];
    switch (this.form.get('sourceType')?.value) {
      case 'prismatica': return [...controls, 'prismHeight', 'prismWidth', 'prismDepth'];
      case 'esferica': return [...controls, 'sphereRadius'];
      case 'cilindrica': return [...controls, 'cylinderHeight', 'cylinderRadius'];
      case 'pontual': return controls;
      default: return controls;
    }
  }

  markStepAsTouched(step: number): void {
    const controls = step === 1 ? this.apertureControls() : this.sourceControls();
    controls.forEach(control => this.form.get(control)?.markAsTouched());
  }

  cancel(): void {
    this.router.navigate(['/all']);
  }

  updateApertureFields(value: string) {
    if (value === 'circular') {
      this.form.get('apertureRadius')?.setValidators([Validators.required, this.positiveDecimalValidator]);
      this.form.get('apertureHeight')?.clearValidators();
      this.form.get('apertureWidth')?.clearValidators();
    } else if (value === 'rectangular') {
      this.form.get('apertureHeight')?.setValidators([Validators.required, this.positiveDecimalValidator]);
      this.form.get('apertureWidth')?.setValidators([Validators.required, this.positiveDecimalValidator]);
      this.form.get('apertureRadius')?.clearValidators();
    }
    this.form.get('apertureRadius')?.updateValueAndValidity();
    this.form.get('apertureHeight')?.updateValueAndValidity();
    this.form.get('apertureWidth')?.updateValueAndValidity();
  }
  updateSourceFields(value: string) {
    if (value === 'prismatica') {
      this.form.get('prismHeight')?.setValidators([Validators.required, this.positiveDecimalValidator]);
      this.form.get('prismWidth')?.setValidators([Validators.required, this.positiveDecimalValidator]);
      this.form.get('prismDepth')?.setValidators([Validators.required, this.positiveDecimalValidator]);
      this.form.get('sphereRadius')?.clearValidators();
      this.form.get('cylinderHeight')?.clearValidators();
      this.form.get('cylinderRadius')?.clearValidators();
    } else if (value === 'esferica') {
      this.form.get('sphereRadius')?.setValidators([Validators.required, this.positiveDecimalValidator]);
      this.form.get('prismHeight')?.clearValidators();
      this.form.get('prismWidth')?.clearValidators();
      this.form.get('prismDepth')?.clearValidators();
      this.form.get('cylinderHeight')?.clearValidators();
      this.form.get('cylinderRadius')?.clearValidators();
    } else if (value === 'cilindrica') {
      this.form.get('cylinderHeight')?.setValidators([Validators.required, this.positiveDecimalValidator]);
      this.form.get('cylinderRadius')?.setValidators([Validators.required, this.positiveDecimalValidator]);
      this.form.get('prismHeight')?.clearValidators();
      this.form.get('prismWidth')?.clearValidators();
      this.form.get('prismDepth')?.clearValidators();
      this.form.get('sphereRadius')?.clearValidators();
    } else if (value === 'pontual') {
      this.form.get('prismHeight')?.clearValidators();
      this.form.get('prismWidth')?.clearValidators();
      this.form.get('prismDepth')?.clearValidators();
      this.form.get('sphereRadius')?.clearValidators();
      this.form.get('cylinderHeight')?.clearValidators();
      this.form.get('cylinderRadius')?.clearValidators();
    }
    this.form.get('prismHeight')?.updateValueAndValidity();
    this.form.get('prismWidth')?.updateValueAndValidity();
    this.form.get('prismDepth')?.updateValueAndValidity();
    this.form.get('sphereRadius')?.updateValueAndValidity();
    this.form.get('cylinderHeight')?.updateValueAndValidity();
    this.form.get('cylinderRadius')?.updateValueAndValidity();
    this.form.get('sourceCenterX')?.updateValueAndValidity();
    this.form.get('sourceCenterY')?.updateValueAndValidity();
    this.form.get('sourceCenterZ')?.updateValueAndValidity();
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initThree();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.controls?.dispose();
    this.renderer?.dispose();
    this.resizeObserver?.disconnect();
  }

  initThree(): void{
    const container = this.el.nativeElement.querySelector('.threejs-container');

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
    this.renderer.shadowMap.enabled = true;
    this.scene.background = new THREE.Color('#f3f5f7');

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

    this.scene.add(this.previewGroup);
    this.addStaticSceneHelpers();
    this.observeContainerResize(container);
    this.controls.addEventListener('start', () => {
      this.isUserInteracting = true;
    });

    this.updateScene();
    this.resizeRendererToContainer();
    this.animate();
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

  resetCameraView(): void {
    this.isUserInteracting = false;
    this.fitCameraToPreview();
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }


  updateScene(): void {
    let { apertureType, sourceType, apertureZAxisHeight, apertureHeight, apertureWidth, apertureRadius,
      prismHeight, prismWidth, prismDepth, sphereRadius, cylinderHeight, cylinderRadius,
      sourceCenterX, sourceCenterY, sourceCenterZ } = this.form.value;

    apertureZAxisHeight = this.toNumber(apertureZAxisHeight);
    apertureHeight = this.toNumber(apertureHeight);
    apertureWidth = this.toNumber(apertureWidth);
    apertureRadius = this.toNumber(apertureRadius);
    prismHeight = this.toNumber(prismHeight);
    prismWidth = this.toNumber(prismWidth);
    prismDepth = this.toNumber(prismDepth);
    sphereRadius = this.toNumber(sphereRadius);
    cylinderHeight = this.toNumber(cylinderHeight);
    cylinderRadius = this.toNumber(cylinderRadius);
    sourceCenterX = this.toNumber(sourceCenterX);
    sourceCenterY = this.toNumber(sourceCenterY);
    sourceCenterZ = this.toNumber(sourceCenterZ);

    const schema: PreviewSchema = {
      apertureType,
      sourceType,
      apertureHeight: apertureZAxisHeight,
      apertureWidth: apertureHeight,
      apertureDepth: apertureWidth,
      apertureRadius,
      sourceHeight: sourceType === 'cilindrica' ? cylinderHeight : prismHeight,
      sourceWidth: prismWidth,
      sourceDepth: prismDepth,
      sourceRadius: sourceType === 'cilindrica' ? cylinderRadius : sphereRadius,
      sourceCenterX,
      sourceCenterY,
      sourceCenterZ
    };
    this.service.renderPreviewFromSchema(this.previewGroup, schema);

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

  private toNumber(value: unknown, fallback: number = 0): number {
    const parsedValue = this.parseDecimal(value);
    return parsedValue !== null && Number.isFinite(parsedValue) ? parsedValue : fallback;
  }

  private getNumericFormValues(): NumericFormValues {
    return Object.fromEntries(
      Object.entries(this.form.getRawValue()).map(([key, value]) => [key, this.toNumber(value)])
    ) as unknown as NumericFormValues;
  }

  private decimalValidator(allowNegative: boolean, allowZero: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = this.parseDecimal(control.value);
      if (value === null) {
        return control.value === null || control.value === '' ? null : { decimal: true };
      }
      if ((!allowNegative && value < 0) || (!allowZero && value <= 0)) {
        return { positive: true };
      }
      return null;
    };
  }

  private parseDecimal(value: unknown): number | null {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }
    if (typeof value !== 'string') {
      return null;
    }

    const normalizedValue = value.trim().replace(',', '.');
    if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalizedValue)) {
      return null;
    }

    const parsedValue = Number(normalizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  onApertureChange(): void {
    this.updateScene();
  }

  onSourceTypeChange(): void {
    this.updateScene();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeRendererToContainer();
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
