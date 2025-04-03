import { Component, OnInit, AfterViewInit, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormsModule, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreeServiceService } from '../../service/three-service.service';
import { ApiService } from '../../service/api/api.service';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-simulacao',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-simulacao.component.html',
  styleUrls: ['./cadastro-simulacao.component.scss']
})
export class CadastroSimulacaoComponent implements OnInit, AfterViewInit {
  form!: FormGroup;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;

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
      emissions: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      sourceZAxisHeight: new FormControl<number>(0, Validators.min(0)),
      apertureType: new FormControl<string>('', Validators.required),
      apertureZAxisHeight: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      apertureRadius: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      apertureHeight: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      apertureWidth: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      sourceType: new FormControl<string>('', Validators.required),
      prismHeight: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      prismWidth: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      prismDepth: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      sphereRadius: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      cylinderHeight: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      cylinderRadius: new FormControl<number>(0, [Validators.required, Validators.min(1)])
    });


    this.form.get('apertureType')?.valueChanges.subscribe(value => {
      this.updateApertureFields(value);
    });

    this.form.get('sourceType')?.valueChanges.subscribe(value => {
      this.updateSourceFields(value);
    });
  }

  async onSubmit(): Promise<void> {
    let aperture: any;
    let sourceType;
    let apertureType;
    if (this.form.get('apertureType')?.value === 'circular') {
      aperture = {
        type: 'circular',
        radius: this.form.value.apertureRadius,
        height: this.form.value.apertureZAxisHeight
      };
      apertureType = 'CIRCULAR';
    } else if (this.form.get('apertureType')?.value === 'rectangular') {
      aperture = {
        type: 'rectangular',
        width: this.form.value.apertureWidth,
        height: this.form.value.apertureZAxisHeight,
        depth: this.form.value.apertureHeight
      };
      apertureType = 'RECTANGULAR';
    }
  
    let source: any;
    if (this.form.get('sourceType')?.value === 'prismatica') {
      source = {
        type: 'cuboid',
        height: this.form.value.prismHeight,
        width: this.form.value.prismWidth,
        depth: this.form.value.prismDepth
      };
      sourceType = 'CUBOID';
    } else if (this.form.get('sourceType')?.value === 'esferica') {
      source = {
        type: 'spherical',
        radius: this.form.value.sphereRadius
      };
      sourceType = 'SPHERICAL'
    } else if (this.form.get('sourceType')?.value === 'cilindrica') {
      source = {
        type: 'cylindrical',
        height: this.form.value.cylinderHeight,
        radius: this.form.value.cylinderRadius
      };
      sourceType = 'CYLINDRICAL';
    }
    const request = {
      emissions: this.form.value.emissions,
      sourceHeight: this.form.value.sourceZAxisHeight,
      apertureType: apertureType,
      aperture: aperture,
      sourceType: sourceType,
      source: source
    };
 
    console.log('apertureZAxisHeight:', this.form.get('apertureZAxisHeight')?.value);

    this.apiService.createNewContext(request).subscribe({
      next: () => {
        this.notificationService.showAlert('Simulação criada com sucesso!', () => {
          this.router.navigate(['/home']);
        });
      },
      error: (err) => {
        console.error('Erro ao criar simulação:', err);
        this.notificationService.showAlert('Falha ao criar simulação');
      }
    });
  }

  updateApertureFields(value: string) {
    if (value === 'circular') {
      this.form.get('apertureRadius')?.setValidators(Validators.required);
      this.form.get('apertureHeight')?.clearValidators();
      this.form.get('apertureWidth')?.clearValidators();
    } else if (value === 'rectangular') {
      this.form.get('apertureHeight')?.setValidators(Validators.required);
      this.form.get('apertureWidth')?.setValidators(Validators.required);
      this.form.get('apertureRadius')?.clearValidators();
    }
    this.form.get('apertureRadius')?.updateValueAndValidity();
    this.form.get('apertureHeight')?.updateValueAndValidity();
    this.form.get('apertureWidth')?.updateValueAndValidity();
  }
  updateSourceFields(value: string) {
    if (value === 'prismatica') {
      this.form.get('prismHeight')?.setValidators(Validators.required);
      this.form.get('prismWidth')?.setValidators(Validators.required);
      this.form.get('prismDepth')?.setValidators(Validators.required);
      this.form.get('sphereRadius')?.clearValidators();
      this.form.get('cylinderHeight')?.clearValidators();
      this.form.get('cylinderRadius')?.clearValidators();
    } else if (value === 'esferica') {
      this.form.get('sphereRadius')?.setValidators(Validators.required);
      this.form.get('prismHeight')?.clearValidators();
      this.form.get('prismWidth')?.clearValidators();
      this.form.get('prismDepth')?.clearValidators();
      this.form.get('cylinderHeight')?.clearValidators();
      this.form.get('cylinderRadius')?.clearValidators();
    } else if (value === 'cilindrica') {
      this.form.get('cylinderHeight')?.setValidators(Validators.required);
      this.form.get('cylinderRadius')?.setValidators(Validators.required);
      this.form.get('prismHeight')?.clearValidators();
      this.form.get('prismWidth')?.clearValidators();
      this.form.get('prismDepth')?.clearValidators();
      this.form.get('sphereRadius')?.clearValidators();
    }
    this.form.get('prismHeight')?.updateValueAndValidity();
    this.form.get('prismWidth')?.updateValueAndValidity();
    this.form.get('prismDepth')?.updateValueAndValidity();
    this.form.get('sphereRadius')?.updateValueAndValidity();
    this.form.get('cylinderHeight')?.updateValueAndValidity();
    this.form.get('cylinderRadius')?.updateValueAndValidity();
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initThree();
    }
  }

  initThree(): void{
    const container = this.el.nativeElement.querySelector('.threejs-container');

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(container.clientWidth*0.5, container.clientHeight * 0.8);
    container.appendChild(this.renderer.domElement);

    this.renderer.domElement.style.margin = '0 auto';
    this.renderer.domElement.style.borderRadius = '8px';
    this.renderer.domElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';

    this.scene.background = new THREE.Color('gray');
    

    const aspectRatio = container.clientWidth / container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 30); 

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;


    const axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(axesHelper);

    this.updateScene();
    this.animate();
  }


  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }


  updateScene(): void {
    this.scene.clear();
    let { apertureType, sourceType, apertureZAxisHeight, apertureHeight, apertureWidth, apertureRadius,
      prismHeight, prismWidth, prismDepth, sphereRadius, cylinderHeight, cylinderRadius } = this.form.value;

    let sourceHeight;


    if (apertureType === 'rectangular') {

      const prism = this.service.generatePrism(apertureZAxisHeight, apertureHeight, apertureWidth, true);
      this.scene.add(prism);

    } else if (apertureType === 'circular') {

      const cylinder = this.service.generateCylinder(apertureZAxisHeight, apertureRadius, true);
      this.scene.add(cylinder);
    }


    if (sourceType === 'prismatica') {

      const prism = this.service.generatePrism(prismHeight, prismWidth, prismDepth, false);
      this.scene.add(prism);

    } else if (sourceType === 'esferica') {

      const sphere = this.service.generateSphere(sphereRadius);
      this.scene.add(sphere);

    } else if (sourceType === 'cilindrica') {

      const cylinder = this.service.generateCylinder(cylinderHeight, cylinderRadius, false);
      this.scene.add(cylinder);

    }

    const axesHelper = new THREE.AxesHelper(10)
    this.scene.add(axesHelper);
  }

  onApertureChange(): void {
    this.updateScene();
  }

  onsourceTypeChange(): void {
    this.updateScene();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const container = this.el.nativeElement.querySelector('.threejs-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
