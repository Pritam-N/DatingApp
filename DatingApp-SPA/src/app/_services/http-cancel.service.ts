import { Injectable, ɵConsole } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { takeUntil, delay } from 'rxjs/operators';
import { Router, ActivationEnd } from '@angular/router';
import { IfStmt } from '@angular/compiler';


@Injectable()
export class HttpCancelService {
  constructor() {
   }
  prevReq: HttpRequest<any>;

  private pendingHTTPRequests$ = new Subject<void>();
    SavePrevRequest(req: HttpRequest<any>): boolean {
      if (this.prevReq != null) {
        if (req.url.split('=')[0] === this.prevReq.url.split('=')[0]) {
          return true;
        }
      }
      this.prevReq = req;
      return false;
    }

  public cancelPendingRequests() {
    this.pendingHTTPRequests$.next();
  }
  public onCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }
}
