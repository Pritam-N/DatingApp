import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_thirdpartyservices/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/Message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {

    pageNumber = 1;
    pageSize = 8;
    messageContainer = 'Unread';

    constructor(
            private userService: UserService,
            private router: Router,
            private alertify: AlertifyService,
            private authService: AuthService) {}

    // tslint:disable-next-line: max-line-length
    resolve(route: ActivatedRouteSnapshot): Observable<Message[]>  {
        return this.userService.getMessages(this.authService.decodedToken.nameid,
            this.pageNumber, this.pageSize, this.messageContainer).pipe(
            catchError( error => {
                this.alertify.error('Problem retrieving data.');
                this.router.navigate(['/home']);
                return of(null);
            }));
    }
}
