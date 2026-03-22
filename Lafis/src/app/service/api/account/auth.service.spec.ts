import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const buildTokenWithExp = (exp: number): string => {
    const toBase64Url = (value: unknown): string =>
      btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

    return `${toBase64Url({ alg: 'HS256', typ: 'JWT' })}.${toBase64Url({ exp })}.signature`;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when token is valid and not expired', () => {
    const expInFuture = Math.floor(Date.now() / 1000) + 3600;
    const token = buildTokenWithExp(expInFuture);

    service.setToken(token);

    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false when token is expired', () => {
    const expInPast = Math.floor(Date.now() / 1000) - 60;
    const token = buildTokenWithExp(expInPast);

    service.setToken(token);

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.isTokenExpired(token)).toBeTrue();
  });

  it('should treat malformed token as expired', () => {
    expect(service.isTokenExpired('invalid-token')).toBeTrue();
  });
});
