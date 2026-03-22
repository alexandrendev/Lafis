import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { AuthService } from '../../service/api/account/auth.service';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);
    notificationServiceMock = jasmine.createSpyObj<NotificationService>('NotificationService', ['showAlert']);
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['clearToken']);

    notificationServiceMock.showAlert.and.callFake((_: string, onConfirm: () => void) => {
      onConfirm();
    });

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
