import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_thirdpartyservices/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Cities } from 'src/app/_models/Cities';
import { States } from 'src/app/_models/States';
import { Countries } from 'src/app/_models/Countries';
import { CommonHelperService } from 'src/app/_services/common-helper.service';
import { PaginationResult } from 'src/app/_models/Pagination';


@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', {static: true}) editForm: NgForm;
  user: User;
  photoUrl: string;

  _listCities: Cities[];
  _listStates: States[];
  _listCountries: Countries[];

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(private route: ActivatedRoute,
              private alertify: AlertifyService,
              private userService: UserService,
              private authService: AuthService,
              private commonService: CommonHelperService) {
              }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;

    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    this.getAddressDetails(this.user);
  }
  onCountrySelected(id: string) {
    this.commonService.getStates(this.user.country)
    .subscribe((res: PaginationResult<States[]>) => {
      this._listStates = res.result;
    }, error => {
      this.alertify.error(error);
    });
  }

  onStateSelected(id: string) {
    this.commonService.getCities(this.user.state)
    .subscribe((res: PaginationResult<Cities[]>) => {
        this._listCities = res.result;
    }, error => {
      this.alertify.error(error);
    });
  }
  getAddressDetails(user) {
    this.commonService.getCities(user.state)
    .subscribe((res: PaginationResult<Cities[]>) => {
        this._listCities = res.result;
    }, error => {
      this.alertify.error(error);
    });
    this.commonService.getStates(user.country)
    .subscribe((res: PaginationResult<States[]>) => {
      this._listStates = res.result;
    }, error => {
      this.alertify.error(error);
    });
    this.commonService.getCountries()
    .subscribe((res: PaginationResult<Countries[]>) => {
      this._listCountries = res.result;
    }, error => {
      this.alertify.error(error);
    });
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('Profile updated successfully.');
      console.log(this.user);
      this.editForm.reset(this.user);
    }, (error: string) => {
      this.alertify.error(error);
    });
  }

  updateMainPhoto(photoUrl: string) {
    this.user.photoUrl = photoUrl;
  }

}
