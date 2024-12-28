import { booleanAttribute, Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeServiceService {
  
  constructor() { }

  public generateSphere(radius: number): THREE.Mesh{
    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshBasicMaterial({color: 'blue', wireframe: false})
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    return sphere;
  }


  public generatePrism(height: number, width: number, depth: number, aperture: boolean): THREE.Mesh{
    const geometry = new THREE.BoxGeometry(width, height, depth);
    let material;
    if(aperture === false){
        material = new THREE.MeshBasicMaterial({color: 'blue',wireframe: false });
    }
    else {material = new THREE.MeshNormalMaterial({wireframe: false, transparent: true, opacity: 0.5});}
    
    const prism = new THREE.Mesh(geometry, material);
    prism.position.set(0,0,0); 
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
    cylinder.position.set(0, 0, 0);
    return cylinder;
  }
}
