import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';  // Importação do OrbitControls

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

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.scene = new THREE.Scene();
  }

  ngAfterViewInit(): void {
    const container = this.el.nativeElement.querySelector('.threejs-container');
    
    // Inicializa o renderizador
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('white');

    // Inicializa a câmera
    const aspectRatio = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.z = 5;

    // Adicionando os controles de órbita
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;  // Habilitar amortecimento (movimento suave)
    this.controls.dampingFactor = 0.25;  // Fator de amortecimento
    this.controls.screenSpacePanning = false;  // Evitar movimentação em planos 2D

    // Chama a função para renderizar a cena
    const axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(axesHelper);

    this.updateScene();
    this.animate();
  }

  // Função para renderizar a cena
  animate() {
    requestAnimationFrame(() => this.animate());

    // Atualizar controles antes de renderizar
    this.controls.update();  // Necessário para o amortecimento funcionar

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

    // Abertura
    if (this.apertureType === 'rectangular') {
      const geometry = new THREE.BoxGeometry(this.apertureWidth, this.sourceHeight*3, this.apertureHeight);
      const material = new THREE.MeshNormalMaterial({ wireframe: false, transparent: true, opacity: 0.5 });
      const prism = new THREE.Mesh(geometry, material);
      prism.position.y = 0; 
      prism.position.z = 0; // Posiciona a abertura
      this.scene.add(prism);
    } else if (this.apertureType === 'circular') {
      const geometry = new THREE.CylinderGeometry(this.apertureRadius, this.apertureRadius, this.sourceHeight * 3, 100,100, false);
      const material = new THREE.MeshNormalMaterial({ wireframe: false, transparent: true, opacity: 0.5 });
      const circle = new THREE.Mesh(geometry, material);
      this.scene.add(circle);
    }

    // Fonte
    if (this.sourceType === 'prismatica') {
      const geometry = new THREE.BoxGeometry(this.prismWidth, this.prismHeight, this.prismDepth);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const prism = new THREE.Mesh(geometry, material);
      prism.position.set(0, 0, 0);  // Posiciona o prisma
      this.scene.add(prism);
    } else if (this.sourceType === 'esferica') {
      const geometry = new THREE.SphereGeometry(this.sphereRadius);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(0, 0, 0);  // Posiciona a esfera
      this.scene.add(sphere);
    } else if (this.sourceType === 'cilindrica') {
      const geometry = new THREE.CylinderGeometry(this.cylinderRadius, this.cylinderRadius, this.cylinderHeight);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.set(0, 0, 0);  // Posiciona o cilindro
      this.scene.add(cylinder);
    }
  }

  // Manipula a mudança no tipo de abertura
  onApertureChange(): void {
    this.updateScene();
  }

  // Manipula a mudança no tipo de fonte
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
