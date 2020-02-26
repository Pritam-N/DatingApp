import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_thirdpartyservices/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { CommonHelperService } from '../_services/common-helper.service';
import { PaginationResult } from '../_models/Pagination';
import { Cities } from '../_models/Cities';
import { States } from '../_models/States';
import { Countries } from '../_models/Countries';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  validRegistrationDate = new Date();
  _listCountries: Countries[];
  _listStates: States[];
  _listCities: Cities[];
  // _countrySelected :boolean =  true;
  // _stateSelected = true;
 constructor(private authService: AuthService,
              private alertify: AlertifyService,
              private fb: FormBuilder,
              private router: Router,
              private commonService: CommonHelperService) {
                this.validRegistrationDate.setUTCFullYear(this.validRegistrationDate.getUTCFullYear() - 14);
               }

  ngOnInit() {
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('',
    //           [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmpassword: new FormControl('', Validators.required)
    // }, this.passwordMatchValidator);
    this.bsConfig = {
      containerClass: 'theme-red',
      maxDate: this.validRegistrationDate
    };
    this.getAddressDetails();
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      commonname: ['', Validators.required],
      dob: [null, Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required, ],
      password: ['',
              [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmpassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator});
    this.registerForm.get('state').disable();
    this.registerForm.get('city').disable();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmpassword').value ? null : {mismatch: true };
  }
  cancel() {
    this.cancelRegister.emit(false);
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(next => {
        this.alertify.success('Registration successfull.');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }

  getAddressDetails() {
    this.commonService.getCountries()
    .subscribe((res: PaginationResult<Countries[]>) => {
      this._listCountries = res.result;
    }, error => {
      this.alertify.error(error);
    });
  }
  onCountrySelected(id: string) {
    if (id !== '0') {
      console.log('country selected');
      this.registerForm.get('state').enable();
      this.commonService.getStates(id)
      .subscribe((res: PaginationResult<States[]>) => {
        this._listStates = res.result;
      }, error => {
        this.alertify.error(error);
      });
    } else {
      this._countrySelected =  true;
      console.log('country  0 selected');
    }
  }
  onStateSelected(id: string) {
    if (id !== '0') {
      this.registerForm.get('city').enable();
      this.commonService.getCities(id)
      .subscribe((res: PaginationResult<Cities[]>) => {
          this._listCities = res.result;
      }, error => {
        this.alertify.error(error);
      });
    }
  }
}
