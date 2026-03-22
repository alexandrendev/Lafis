import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../service/api/account/auth.service";

export function authInterceptor(
    req: HttpRequest<unknown>, 
    next: HttpHandlerFn): Observable<HttpEvent<unknown>> 
{
    const authService = inject(AuthService);
    const router = inject(Router);

    if(req.headers.get('useAuth') === 'n'){
        return next(req);
    }

    const token = authService.getToken();

    if (!token || authService.isTokenExpired(token)) {
        authService.clearToken();
        const currentUrl = router.url || '/';
        if (!currentUrl.includes('/login')) {
            router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });
        }
        return throwError(() => new HttpErrorResponse({
            status: 401,
            statusText: 'Token expired'
        }));
    }

    const headers = req.headers
        .set('Authorization', `Bearer ${token}`)
        .delete('useAuth');
    const newReq = req.clone({ headers });

    return next(newReq).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                authService.clearToken();
                const currentUrl = router.url || '/';
                if (!currentUrl.includes('/login')) {
                    router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });
                }
            }

            return throwError(() => error);
        })
    );
}
