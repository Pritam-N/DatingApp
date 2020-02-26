
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, takeUntil, delay } from 'rxjs/operators';
import { throwError, Observable, Subject } from 'rxjs';
import { Router, ActivationEnd } from '@angular/router';
import { HttpCancelService } from '../_services/http-cancel.service';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

@Injectable()


export class ManageHttp implements HttpInterceptor{
    sameUrlReq: boolean;
    constructor( private httpCancelService: HttpCancelService ) {
            // router.events.subscribe(event => {
            //     // An event triggered at the end of the activation part of the Resolve phase of routing.
            //     if (event instanceof ActivationEnd) {
            //         this.httpCancelService.cancelPendingRequests();
            //     }
            // });
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.split('=')[0] === 'http://localhost:5001/SentenceComplete?text') {
            this.sameUrlReq = this.httpCancelService.SavePrevRequest(req);
            if (this.sameUrlReq) {
                this.httpCancelService.cancelPendingRequests();
            }
        }
        return next.handle(req).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
    }
}
// export const HttpInterceptorProvider = {
//     provide: HTTP_INTERCEPTORS,
//     useClass: ManageHttp,
//     multi: true
// };
