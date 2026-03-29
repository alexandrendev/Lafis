import { Injectable } from '@angular/core';
import * as THREE from 'three';

export interface PreviewSchema {
  apertureType?: string;
  sourceType?: string;
  apertureHeight?: number;
  apertureWidth?: number;
  apertureDepth?: number;
  apertureRadius?: number;
  sourceHeight?: number;
  sourceWidth?: number;
  sourceDepth?: number;
  sourceRadius?: number;
  sourceCenterX?: number;
  sourceCenterY?: number;
  sourceCenterZ?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ThreeServiceService {
  
  constructor() { }

  public generateSphere(radius: number): THREE.Mesh{
    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshBasicMaterial({color: 'blue', wireframe: false})
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, radius, 0);
    return sphere;
  }


  public generatePrism(height: number, width: number, depth: number, aperture: boolean): THREE.Mesh{
    const geometry = new THREE.BoxGeometry(width, height, depth);
    let material;
    if(aperture === false){
        material = new THREE.MeshBasicMaterial({color: 'blue',wireframe: false});
    }
    else {material = new THREE.MeshNormalMaterial({wireframe: false, transparent: true, opacity: 0.5});}
    
    const prism = new THREE.Mesh(geometry, material);
    prism.position.set(0, height / 2, 0); 
    return prism;
  }

  public generateCylinder(cylinderHeight: number, cylinderRadius: number, aperture: boolean): THREE.Mesh{

    const geometry = new THREE.CylinderGeometry(
        cylinderRadius, 
        cylinderRadius, 
        cylinderHeight
    );
    let material;
    if(aperture === false){
        material = new THREE.MeshBasicMaterial({ color: 'blue', wireframe: false});    
    }
    else{material = new THREE.MeshNormalMaterial({wireframe: false, transparent: true, opacity: 0.5});}

    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(0, cylinderHeight / 2 , 0);
    return cylinder;
  }

  public renderPreviewFromSchema(previewGroup: THREE.Group, schema: PreviewSchema): void {
    previewGroup.clear();

    const apertureType = (schema.apertureType || '').toLowerCase();
    const sourceType = (schema.sourceType || '').toLowerCase();

    const apertureHeight = this.toNumber(schema.apertureHeight);
    const apertureWidth = this.toNumber(schema.apertureWidth);
    const apertureDepth = this.toNumber(schema.apertureDepth);
    const apertureRadius = this.toNumber(schema.apertureRadius);

    const sourceHeight = this.toNumber(schema.sourceHeight);
    const sourceWidth = this.toNumber(schema.sourceWidth);
    const sourceDepth = this.toNumber(schema.sourceDepth);
    const sourceRadius = this.toNumber(schema.sourceRadius);
    const sourceCenterX = this.toNumber(schema.sourceCenterX);
    const sourceCenterY = this.toNumber(schema.sourceCenterY);
    const sourceCenterZ = this.toNumber(schema.sourceCenterZ);

    if (apertureType === 'rectangular') {
      const prism = this.generatePrism(apertureHeight, apertureWidth, apertureDepth, true);
      previewGroup.add(prism);
    } else if (apertureType === 'circular') {
      const cylinder = this.generateCylinder(apertureHeight, apertureRadius, true);
      previewGroup.add(cylinder);
    }

    if (sourceType === 'cuboid' || sourceType === 'prismatica') {
      const prism = this.generatePrism(sourceHeight, sourceWidth, sourceDepth, false);
      prism.position.set(sourceCenterX, sourceCenterZ + sourceHeight / 2, sourceCenterY);
      previewGroup.add(prism);
    } else if (sourceType === 'spherical' || sourceType === 'esferica') {
      const sphere = this.generateSphere(sourceRadius);
      sphere.position.set(sourceCenterX, sourceCenterZ, sourceCenterY);
      previewGroup.add(sphere);
    } else if (sourceType === 'cylindrical' || sourceType === 'cilindrica') {
      const cylinder = this.generateCylinder(sourceHeight, sourceRadius, false);
      cylinder.position.set(sourceCenterX, sourceCenterZ + sourceHeight / 2, sourceCenterY);
      previewGroup.add(cylinder);
    } else if (sourceType === 'point' || sourceType === 'pontual') {
      const point = this.generateSphere(0.5);
      point.position.set(sourceCenterX, sourceCenterZ, sourceCenterY);
      previewGroup.add(point);
    }
  }

  private toNumber(value: unknown, fallback: number = 0): number {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
  }
}
