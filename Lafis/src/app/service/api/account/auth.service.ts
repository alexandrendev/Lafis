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
          this.setToken(tokenResponse.token);
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

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public clearToken(): void {
    localStorage.removeItem('token');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    return !this.isTokenExpired(token);
  }

  public isTokenExpired(token: string): boolean {
    const payload = this.decodeJwtPayload(token);

    if (!payload || typeof payload.exp !== 'number') {
      return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds;
  }

  private decodeJwtPayload(token: string): { exp?: number } | null {
    const tokenParts = token.split('.');

    if (tokenParts.length !== 3 || !tokenParts[1]) {
      return null;
    }

    try {
      const normalizedPayload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (normalizedPayload.length % 4)) % 4);
      const payload = atob(normalizedPayload + padding);
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }
}
