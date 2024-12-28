import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormsModule, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeServiceService } from '../../service/three-service.service';

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

  constructor(private el: ElementRef, private service: ThreeServiceService) {}

  ngOnInit(): void {
    this.scene = new THREE.Scene();

    this.form = new FormGroup({
      emissions: new FormControl<number>(0, [Validators.required, Validators.min(1)]),  // 'emissions' com valor mínimo de 1
      apertureType: new FormControl<string>('', Validators.required),
      apertureRadius: new FormControl<number>(0),
      apertureHeight: new FormControl<number>(0),
      apertureWidth: new FormControl<number>(0),
      sourceType: new FormControl<string>('prismatica', Validators.required),
      prismHeight: new FormControl<number>(0),
      prismWidth: new FormControl<number>(0),
      prismDepth: new FormControl<number>(0),
      sphereRadius: new FormControl<number>(0),
      cylinderHeight: new FormControl<number>(0),
      cylinderRadius: new FormControl<number>(0)
    });
    
    this.form.get('apertureType')?.valueChanges.subscribe(value => {
      this.updateApertureFields(value);
    });
    
    this.form.get('sourceType')?.valueChanges.subscribe(value => {
      this.updateSourceFields(value);
    });
  }

  updateApertureFields(value: string){
    if(value === 'circular'){
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
  updateSourceFields(value: string){
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
    const container = this.el.nativeElement.querySelector('.threejs-container');
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('white');

    const aspectRatio = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.z = 5;
  
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

  onSubmit(): void {
    this.updateScene();
  }

  updateScene(): void {
    this.scene.clear();
    let { apertureType, sourceType, apertureHeight, apertureWidth, apertureRadius, 
      prismHeight, prismWidth, prismDepth, sphereRadius, cylinderHeight, cylinderRadius } = this.form.value;

    let sourceHeight;

    if(sourceType === 'prismatica') sourceHeight = prismHeight;
    else if(sourceType === 'cilindrica') sourceHeight = cylinderHeight;
    else sourceHeight = sphereRadius;


    if (apertureType === 'rectangular') {
      
      const prism = this.service.generatePrism(apertureHeight,sourceHeight * 3, apertureWidth, true);
      this.scene.add(prism);

    } else if (apertureType === 'circular') {

      const cylinder = this.service.generateCylinder(sourceHeight * 3, apertureRadius, true);
      this.scene.add(cylinder);
    }


    if (sourceType === 'prismatica') {

      const prism = this.service.generatePrism(prismHeight, prismWidth, prismDepth, false);
      this.scene.add(prism);
    
    } else if (sourceType === 'esferica') {

      const sphere = this.service.generateSphere(sphereRadius);
      this.scene.add(sphere);

    } else if (sourceType === 'cilindrica') {
    
      const cylinder = this.service.generateCylinder(cylinderHeight, cylinderRadius,false);
      this.scene.add(cylinder);
    
    }
  }

  onApertureChange(): void {
    this.updateScene();
  }

  onsourceTypeChange(): void {
    this.updateScene();
  }

  // Redimensiona o canvas quando a janela é redimensionada
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
