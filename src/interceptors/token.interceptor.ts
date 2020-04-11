import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import * as Sentry from "@sentry/browser";
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { combineAll } from 'rxjs/internal/operators/combineAll';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }

    return this.auth.getToken().pipe(
      switchMap(token => {
        if (token) {
          // Add the transaction id to the Sentry scope
          const transactionId = Math.random().toString(36).substr(2, 9);
          Sentry.configureScope(scope => {
            scope.setTransaction(transactionId);
          });
          request = request.clone({
            setHeaders: {
              authorization: token,
              'x-transaction-id': transactionId
            },
          });
        }
        return next.handle(request);
      }),
    );
  }
}
