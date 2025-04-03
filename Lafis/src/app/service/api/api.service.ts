import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = `${environment.apiUrl}/simulation`;

  private readonly api = inject(HttpClient);


  findById(id: string): Observable<any>{

    return this.api.get(`${this.apiUrl}/id?simulationId=${id}`);
  }

  async findRunning() {
    return fetch(`${this.apiUrl}/running`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao obter todas as simulações: ${response.statusText}`);
        }
        return response.json();
      }).catch(error => {
        throw new Error(`Erro ao obter todas as simulações: ${error}`);
      });
  }

  startSimulation(simulationId: string): Observable<any> {
    return this.api.post(`${this.apiUrl}/start?simulationId=${simulationId}`, {});
  }

  createNewContext(body: any): Observable<any> {
    return this.api.post(`${this.apiUrl}/new-context`, body).pipe(
      catchError(error => {
        console.error('Erro na requisição:', error);
        throw new Error('Erro ao criar a simulação');
      }));
  }

  createNewSimulation(emissions: number, sourceHeight: number): Observable<any> {

    return this.api.post(`${this.apiUrl}/new`, { emissions, sourceHeight });
  }


  getAllSimulations(): Observable<any> {
    const headers = new HttpHeaders().set('useAuth', 'y');

    return this.api.get(`${this.apiUrl}/all`,{ headers });
  }
}
