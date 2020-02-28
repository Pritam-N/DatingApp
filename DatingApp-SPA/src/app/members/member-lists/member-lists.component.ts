import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_thirdpartyservices/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginationResult } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.css']
})
export class MemberListsComponent implements OnInit {
  isCollapsed = true;
  defaultView = true;
  users: User[];
  activeUsers: User[];
  latestLoggedUsers: User[];
  justRegisteredUsers: User[];

  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];
  userParams: any = {};
  pagination: Pagination;
  date: Date = new Date();

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data.users.result;
      this.date = new Date();
      this.activeUsers = this.users.filter(x => new Date(x.lastActive) > new Date(this.date.setHours(this.date.getHours() - 1)));
      this.date = new Date();
      this.latestLoggedUsers = this.users.filter(x => new Date(x.lastActive) > new Date(this.date.setDate(this.date.getDate() - 1)));
      this.date = new Date();
      this.justRegisteredUsers = this.users.filter(x => new Date(x.created) > new Date(this.date.setDate(this.date.getDate() - 1)));
      this.pagination = data.users.pagination;
    });
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 14;
    this.userParams.maxAge = 40;
    this.userParams.orderBy = 'lastActive';
    this.defaultView = true;
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
    this.defaultView = false;
  }

  formatLabel(value: number) {
    if (value > 100) {
      return Math.round(value / 100);
    }

    return value;
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginationResult<User[]>) => {
        this.users = res.result;
        console.log(this.users.length);
        this.pagination = res.pagination;
        this.defaultView = false;
      }, error => {
        this.alertify.error(error);
      });
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 14;
    this.userParams.maxAge = 40;
    // this.userParams.orderBy = 'lastActive';
    this.loadUsers();
    this.defaultView = true;
  }
}
