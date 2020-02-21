import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivationEnd } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { HttpCancelService } from '../_services/http-cancel.service';
export class ManageHttp implements HttpInterceptor {

    constructor(router: Router,
                private httpCancelService: HttpCancelService) {
        router.events.subscribe(event => {
          // An event triggered at the end of the activation part of the Resolve phase of routing.
          if (event instanceof ActivationEnd) {
            // Cancel pending calls
            this.httpCancelService.cancelPendingRequests();
          }
        });
    }
    intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
        console.log(req);
        return next.handle(req).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()))
      }
}
