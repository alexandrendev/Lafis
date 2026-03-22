import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AuthService } from '../service/api/account/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [
      'getToken',
      'isTokenExpired',
      'clearToken'
    ]);
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/home' });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should add authorization header when token is valid', async () => {
    authServiceMock.getToken.and.returnValue('valid-token');
    authServiceMock.isTokenExpired.and.returnValue(false);
    const req = new HttpRequest('GET', '/api/resource');
    let capturedRequest: HttpRequest<unknown> | undefined;

    await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        authInterceptor(req, (request) => {
          capturedRequest = request;
          return of({} as any);
        })
      )
    );

    expect(capturedRequest?.headers.get('Authorization')).toBe('Bearer valid-token');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should clear token and redirect when token is expired', async () => {
    authServiceMock.getToken.and.returnValue('expired-token');
    authServiceMock.isTokenExpired.and.returnValue(true);
    const req = new HttpRequest('GET', '/api/resource');

    await firstValueFrom(
      TestBed.runInInjectionContext(() => authInterceptor(req, (request) => of({} as any)))
    );

    expect(authServiceMock.clearToken).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/home' } }
    );
  });

  it('should clear token and redirect on 401 response', async () => {
    authServiceMock.getToken.and.returnValue('valid-token');
    authServiceMock.isTokenExpired.and.returnValue(false);
    const req = new HttpRequest('GET', '/api/resource');

    await expectAsync(
      firstValueFrom(
        TestBed.runInInjectionContext(() =>
          authInterceptor(req, () =>
            throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }))
          )
        )
      )
    ).toBeRejected();

    expect(authServiceMock.clearToken).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/home' } }
    );
  });
});
