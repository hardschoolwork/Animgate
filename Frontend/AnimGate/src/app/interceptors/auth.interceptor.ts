import { HttpInterceptorFn, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const token = localStorage.getItem('access_token');

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/token/refresh/')) {
        const refresh = localStorage.getItem('refresh_token');

        if (refresh) {
          // ✅ Utilise HttpClient pour rafraîchir le token
          return http.post('http://localhost:8000/api/token/refresh/', { refresh }).pipe(
            switchMap((tokens: any) => {
              localStorage.setItem('access_token', tokens.access);

              // Relance la requête initiale avec le nouveau token
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${tokens.access}` },
              });
              return next(newReq);
            }),
            catchError((refreshError) => {
              // Refresh échoué → déconnexion
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              router.navigate(['/login']);
              return throwError(() => refreshError);
            }),
          );
        } else {
          // Pas de refresh token → déconnexion
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    }),
  );
};
