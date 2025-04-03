import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() { }


  public getSolidAngleDeviation(solidAngle: number, N: number): number {
    return 1.96 * Math.sqrt((solidAngle * (4 * Math.PI - solidAngle)) / N);
}
}
