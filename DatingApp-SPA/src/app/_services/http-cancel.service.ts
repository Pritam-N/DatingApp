import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivationEnd } from '@angular/router';


@Injectable()
export class HttpCancelService implements HttpInterceptor {

  constructor(private http: HttpClient, private router: Router) {
    router.events.subscribe(event => {
      // An event triggered at the end of the activation part of the Resolve phase of routing.
      if (event instanceof ActivationEnd) {
        // Cancel pending calls
        console.log(event);
        this.cancelPendingRequests();
      }
    });
  }

  private pendingHTTPRequests$ = new Subject<void>();

  intercept<T>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    //console.log(req);
    return next.handle(req).pipe(takeUntil(this.onCancelPendingRequests()));
  }
  // Cancel Pending HTTP calls
  public cancelPendingRequests() {
    //console.log(this.pendingHTTPRequests$);
    this.pendingHTTPRequests$.next();
  }
  public onCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }
}
