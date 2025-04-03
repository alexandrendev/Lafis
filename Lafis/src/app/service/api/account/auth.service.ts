import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  public login(username: string, password: string): Observable<Object> {
    const headers = new HttpHeaders().set('useAuth', 'n');

    return this._httpClient.post(`${this.apiUrl}/login`,
      {
        login: username,
        password
      },
    {headers}
    ).pipe(
        map((tokenResponse: any) => {
          localStorage.setItem('token', tokenResponse.token);
          return tokenResponse;
        })
      );
  }

  public register(login: string, password: string){
    const headers = new HttpHeaders().set('useAuth', 'n');

    return this._httpClient.post(`${this.apiUrl}/register`,
      {
        login,
        password,
      },
      {headers},
    );
  }
}
