import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeServiceService } from '../../service/three-service.service';

@Component({
  selector: 'app-cadastro-simulacao',
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro-simulacao.component.html',
  styleUrls: ['./cadastro-simulacao.component.scss']
})
export class CadastroSimulacaoComponent implements OnInit, AfterViewInit {
  apertureType: string = 'rectangular';
  sourceType: string = 'prismatica';
  sourceHeight!: number;


  apertureRadius!: number;
  apertureHeight!: number;
  apertureWidth!: number;

  
  prismWidth!: number;
  prismHeight!: number;
  prismDepth!: number;

  sphereRadius!: number;
  cylinderRadius!: number;
  cylinderHeight!: number;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;

  constructor(private el: ElementRef, private service: ThreeServiceService) {}

  ngOnInit(): void {
    this.scene = new THREE.Scene();
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
    console.log({
      apertureType: this.apertureType,
      sourceType: this.sourceType,
      apertureRadius: this.apertureRadius,
      apertureHeight: this.apertureHeight,
      apertureWidth: this.apertureWidth,
      prismWidth: this.prismWidth,
      prismHeight: this.prismHeight,
      sphereRadius: this.sphereRadius,
      cylinderRadius: this.cylinderRadius,
      cylinderHeight: this.cylinderHeight
    });
    this.updateScene();
  }

  updateScene(): void {
    this.scene.clear();

    if(this.sourceType === 'prismatica') this.sourceHeight = this.prismHeight;
    else if(this.sourceType === 'cilindrica') this.sourceHeight = this.cylinderHeight;
    else this.sourceHeight = this.sphereRadius;

    if (this.apertureType === 'rectangular') {
      
      const prism = this.service.generatePrism(this.apertureHeight,this.sourceHeight * 3, this.apertureWidth, true);
      this.scene.add(prism);

    } else if (this.apertureType === 'circular') {

      const cylinder = this.service.generateCylinder(this.sourceHeight * 3, this.apertureRadius, true);
      this.scene.add(cylinder);
    }


    if (this.sourceType === 'prismatica') {

      const prism = this.service.generatePrism(this.prismHeight,this.prismWidth, this.prismDepth, false);
      this.scene.add(prism);
    
    } else if (this.sourceType === 'esferica') {

      const sphere = this.service.generateSphere(this.sphereRadius);
      this.scene.add(sphere);

    } else if (this.sourceType === 'cilindrica') {
    
      const cylinder = this.service.generateCylinder(this.cylinderHeight,this.cylinderRadius,false);
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
