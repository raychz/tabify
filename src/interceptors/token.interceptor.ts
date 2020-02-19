import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import * as Sentry from "@sentry/browser";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}

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
      mergeMap(token => {
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
      })
    );
  }
}
