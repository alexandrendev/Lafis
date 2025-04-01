import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);

  public login(username: string, password: string): Observable<Object> {
    const headers = new HttpHeaders().set('useAuth', 'n');

    return this._httpClient.post('http://localhost:8080/auth/login',
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
}
