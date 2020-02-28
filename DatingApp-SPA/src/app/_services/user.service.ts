import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';
import { PaginationResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/Message';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = '';
  unreadMessages = new BehaviorSubject<number>(null);
  currentUnreadMessages = this.unreadMessages.asObservable();
  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl + 'users/';
  }

  changeUnreadMessages(msg: number) {
    this.unreadMessages .next(msg);
  }
  getUsers(page?, itemsPerPage?, userParams?, likesParam?, getAllUsers?): Observable<PaginationResult<User[]>> {

    console.log(itemsPerPage);
    const paginatedResult: PaginationResult<User[]> = new PaginationResult<User[]>();
    let params = new HttpParams();

    if (!getAllUsers) {
      if (page != null && itemsPerPage != null) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
      }

      if (userParams != null) {
        params = params.append('minAge', userParams.minAge);
        params = params.append('maxAge', userParams.maxAge);
        params = params.append('gender', userParams.gender);
        params = params.append('orderBy', userParams.orderBy);
      }

      if (likesParam === 'Likers') {
        params = params.append('Likers', 'true');
      }

      if (likesParam === 'Likees') {
        params = params.append('Likees', 'true');
      }
    } else {
      params = params.append('getAllUsers', 'true');
    }
    return this.http.get<User[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;

          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );

  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + id + '/like/' + recipientId, {});
  }

  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginationResult<Message[]> = new PaginationResult<Message[]>();

    let params = new HttpParams();

    params = params.append('messageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Message[]>(this.baseUrl + id + '/messages', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;

          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + id + '/messages', message);
  }

  deleteMessage(userId: number, id: number) {
    return this.http.post(this.baseUrl + userId + '/messages/' + id, {});
  }

  markAsread(userId: number, messageid: number) {
    return this.http.post(this.baseUrl + userId + '/messages/' + messageid + '/read', {})
      .subscribe();
  }

  getUnreadMessages(id: number, messageContainer?) {
    let params = new HttpParams();
    params = params.append('messageContainer', messageContainer);
    return this.http.get<Message[]>(this.baseUrl  + id + '/messages' + '/UnreadMessages', { observe: 'response', params})
    .pipe(
      map(response => {
        if (response.body.length !== 0) {
          this.unreadMessages.next(response.body.length);
        }
        return this.currentUnreadMessages;
      })
    );
  }
}
