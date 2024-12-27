import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = 'http://localhost:8080/simulation';

  constructor(private http: HttpClient) { }

  createNewSimulation(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/new`, {});
  }


  setRectangularAperture(simulationId: string, height: number, width: number, apertureHeight: number): Observable<any> {
    const body = { simulationId, height, width, apertureHeight };
    return this.http.patch<any>(`${this.apiUrl}/rectangular`, body);
  }

  setCircularAperture(simulationId: string, radius: number, height: number): Observable<any> {
    const body = { simulationId, radius, height };
    return this.http.patch<any>(`${this.apiUrl}/circular`, body);
  }


  setCylindricalSource(simulationId: string, initialHeight: number, finalHeight: number, increment: number, sourceHeight: number, sourceRadius: number): Observable<any> {
    const body = { simulationId, initialHeight, finalHeight, increment, sourceHeight, sourceRadius };
    return this.http.patch<any>(`${this.apiUrl}/source/cylindrical`, body);
  }


  setCuboidSource(simulationId: string, sourceHeight: number, sourceWidth: number, initialHeight: number, increment: number): Observable<any> {
    const body = { simulationId, sourceHeight, sourceWidth, initialHeight, increment };
    return this.http.patch<any>(`${this.apiUrl}/source/cuboid`, body);
  }


  setSphericalSource(simulationId: string, sourceRadius: number, initialHeight: number, finalHeight: number, increment: number): Observable<any> {
    const body = { simulationId, sourceRadius, initialHeight, finalHeight, increment };
    return this.http.patch<any>(`${this.apiUrl}/source/spherical`, body);
  }

  
  getAllSimulations(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
