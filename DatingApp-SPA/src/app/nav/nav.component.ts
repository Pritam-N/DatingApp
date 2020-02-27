import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_thirdpartyservices/alertify.service';
import { Router } from '@angular/router';
import { Pagination } from '../_models/Pagination';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { PaginationResult } from '../_models/Pagination';
import { UserService } from '../_services/user.service';
import { CommonHelperService } from '../_services/common-helper.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  unreadMessages: number;
  model: any = {};
  photoUrl: string;
  messageContainer = 'Unread';
  constructor(public authService: AuthService, private alertify: AlertifyService,
              private router: Router, public userService: UserService,
              ) {
                //this.unreadMessages = this.userService.unreadMessages;
  }


  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    //this.userService.currentUnreadMessages.subscribe(msg => this.unreadMessages = msg);
  }
  loadUnreadMessages() {
    this.userService.getUnreadMessages(this.authService.decodedToken.nameid, this.messageContainer)
    .subscribe(res => console.log(res));
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('Logged in successfully.');
    }, error => {
      this.alertify.error(error);
    }, () => {
      this.loadUnreadMessages();
      this.router.navigate(['/members']);
    });
  }

  loggedIn() {
    // const token = localStorage.getItem('token');
    return this.authService.loggedIn();
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.model.username = '';
    this.model.password = '';
    this.router.navigate(['/home']);
  }
}
