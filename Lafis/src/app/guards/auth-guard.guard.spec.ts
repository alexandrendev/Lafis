import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../service/api/account/auth.service';

import { authGuard } from './auth-guard.guard';

describe('authGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/home' });
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated', 'clearToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow navigation when authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);

    const result = executeGuard({} as any, { url: '/home' } as any);

    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login with returnUrl when unauthenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);

    const result = executeGuard({} as any, { url: '/report/1' } as any);

    expect(result).toBeFalse();
    expect(authServiceMock.clearToken).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/report/1' } }
    );
  });
});
