import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = 'http://localhost:8080/simulation';

  constructor(private http: HttpClient) { }

  createNewSimulation(emissions: number, sourceHeight: number): Promise<any> {

    return fetch(`${this.apiUrl}/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({emissions, sourceHeight})
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

    return fetch(`${this.apiUrl}/rectangular`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ simulationId, height, width, apertureHeight })
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

  setCircularAperture(simulationId: string, radius: number, height: number): Promise<any> {
    return fetch(`${this.apiUrl}/circular`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ simulationId, radius, height })
    })
    .then(response => {
      if(!response.ok) {
        throw new Error(`Erro ao definir abertura circular: ${response.statusText}`);
      }
      return response.json();
    }).catch(error => {
      throw new Error(`Erro ao definir abertura circular: ${error}`);
    });
  }


  setCylindricalSource(simulationId: string, sourceHeight: number, sourceRadius: number): Promise<any>{
      return fetch(`${this.apiUrl}/source/cylindrical`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ simulationId, sourceHeight, sourceRadius })
      })
      .then(response => {
        if(!response.ok) {
          throw new Error(`Erro ao definir fonte cilindrica: ${response.statusText}`);
        }
        return response.json();
      }) .catch(error => {
        throw new Error(`Erro ao definir fonte cilindrica: ${error}`);
      });
  }


  setCuboidSource(simulationId: string, sourceHeight: number, sourceWidth: number, sourceDepth: number): Promise<any> {
    return fetch(`${this.apiUrl}/source/cuboid`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ simulationId, sourceHeight, sourceWidth, sourceDepth })
    })
    .then(response => {
      if(!response.ok) {
        throw new Error(`Erro ao definir fonte cuboide: ${response.statusText}`);
      }
      return response.json();
    }).catch(error => {
      throw new Error(`Erro ao definir fonte cuboide: ${error}`);
    });
  }


  setSphericalSource(simulationId: string, sourceRadius: number): Promise<any> {

    return fetch(`${this.apiUrl}/source/spherical`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ simulationId, sourceRadius })
    })
    .then(response => {
      if(!response.ok) {
        throw new Error(`Erro ao definir fonte esférica: ${response.statusText}`);
      }
      return response.json();
    }).catch(error => {
      throw new Error(`Erro ao definir fonte esférica: ${error}`);
    });
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
