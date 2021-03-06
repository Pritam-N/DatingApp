import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_thirdpartyservices/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {

    pageNumber = 1;
    pageSize = 8;
    getAllUsers = true;
    constructor(
            private userService: UserService,
            private router: Router,
            private alertify: AlertifyService) {}

    // tslint:disable-next-line: max-line-length
    resolve(route: ActivatedRouteSnapshot): Observable<User[]>  {
        return this.userService.getUsers(this.pageNumber, this.pageSize, null, null, this.getAllUsers).pipe(
            catchError( error => {
                this.alertify.error('Problem retrieving data.');
                this.router.navigate(['/home']);
                return of(null);
            }));
    }
}
