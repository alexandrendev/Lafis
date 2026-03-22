import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../service/api/account/auth.service';

import { noAuthGuard } from './no-auth.guard';

describe('noAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noAuthGuard(...guardParameters));

  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);
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

  it('should block guest page when authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);

    const result = executeGuard({} as any, { url: '/login' } as any);

    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should allow guest page and clear invalid token when unauthenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);

    const result = executeGuard({} as any, { url: '/login' } as any);

    expect(result).toBeTrue();
    expect(authServiceMock.clearToken).toHaveBeenCalled();
  });
});
