import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { AlertifyService } from '../_thirdpartyservices/alertify.service';

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

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private alertify: AlertifyService,
    ) { }

  ngOnInit() {
    this.getValues();
    // this.loadUsers();
  }

  goToAbout(){
    document.querySelector('#aboutUs').scrollIntoView({ 
      behavior: 'smooth' 
    });
  }

  goToSignupForm(){
    document.querySelector('#signupForm').scrollIntoView({ 
      behavior: 'smooth' 
    });
  }

  registerToggle() {
    this.registerMode = true;
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    }, error => {
      this.alertify.error(error);
    }); 
  }

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
}
