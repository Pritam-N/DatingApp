import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { AlertifyService } from '../_thirdpartyservices/alertify.service';
import { CommonHelperService } from '../_services/common-helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name = 'World';
  registerMode = false;
  values: any;
  users: any;

  model: any = {};
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private alertify: AlertifyService,
    private commonService: CommonHelperService
    ) { }

  ngOnInit() {
    this.getValues();
    // this.loadUsers();
  }

  goToAbout() {
    document.querySelector('#aboutUs').scrollIntoView({
      behavior: 'smooth'
    });
  }

  goToSignupForm() {
    document.querySelector('#signupForm').scrollIntoView({
      behavior: 'smooth'
    });
  }

  registerToggle() {
    this.registerMode = true;
  }

  // loadUsers() {
  //   this.userService.getUsers().subscribe((users: User[]) => {
  //     this.users = users;
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }

  getValues() {
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
      this.values = response;
    }, error => {
      console.log(error);
    });
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }
  contact() {
    if (this.model.senderEmail && this.model.message) {
      this.commonService.sendMessage(this.model).subscribe(() => {
        console.log(this.model);
      });
    }
  }
}
