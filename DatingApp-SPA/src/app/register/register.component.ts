import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  cancel() {
    console.log('cancelled');
    this.cancelRegister.emit(false);
  }

  register() {
    this.authService.register(this.model).subscribe(next => {
      console.log('success');
    }, error => {
      console.log(error);
    });
  }
}
