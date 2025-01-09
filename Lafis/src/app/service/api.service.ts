import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = 'http://localhost:8080/simulation';

  constructor(private http: HttpClient) { }

  createNewSimulation(emissions: number, increment: number, finalHeight: number): Promise<any> {
    const body = { emissions, increment, finalHeight };

    return fetch(`${this.apiUrl}/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({body})
    })
    .then(response => {
      if(!response.ok) {
        throw new Error(`Erro ao criar nova simulação: ${response.statusText}`);
      }
      return response.json();
    }).catch(error => {
      throw new Error(`Erro ao criar nova simulação: ${error}`);
    });
  }


  setRectangularAperture(simulationId: string, height: number, width: number, apertureHeight: number): Promise<any> {
    const body = { simulationId, height, width, apertureHeight };

    return fetch(`${this.apiUrl}/rectangular`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(response => {
      if(!response.ok) {
        throw new Error(`Erro ao definir abertura retângular: ${response.statusText}`);
      }
      return response.json();
    }).catch(error => {
      throw new Error(`Erro ao definir abertura retângular: ${error}`);
    });
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


  getAllSimulations(): Promise<any[]>{
    // return this.http.get<any[]>(`${this.apiUrl}/all`);
    return fetch(`${this.apiUrl}/all`)
      .then(response => {
        if(!response.ok) {
          throw new Error(`Erro ao obter todas as simulações: ${response.statusText}`);
        }
        return response.json();
      }).catch(error => {
        throw new Error(`Erro ao obter todas as simulações: ${error}`);
      });
  }
}
