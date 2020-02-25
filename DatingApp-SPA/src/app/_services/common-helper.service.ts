import { Injectable } from '@angular/core';
import { States } from '../_models/States';
import { Countries } from '../_models/Countries';
import { Cities } from '../_models/Cities';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PaginationResult } from '../_models/Pagination';

@Injectable({
  providedIn: 'root'
})
export class CommonHelperService {
 
  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl + 'common/';
   }
  baseUrl: string;
  sendMessage(model: any) {
    console.log(model);
    return this.http.post(this.baseUrl + 'contactMessage', model).pipe(
      map((response: any) => {
          
      })
    );
  }
  getStates(id: string): Observable<PaginationResult<States[]>> {
    const paginatedResult: PaginationResult<States[]> = new PaginationResult<States[]>();
    return this.http.get<States[]>(this.baseUrl + 'stateList/' + id, { observe: 'response'})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return  paginatedResult;
      })
    );
  }
  getCountries(): Observable<PaginationResult<Countries[]>> {
    const paginatedResult: PaginationResult<Countries[]> = new PaginationResult<Countries[]>();
    return this.http.get<Countries[]>(this.baseUrl + 'countryList', { observe: 'response'})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return  paginatedResult;
      })
    );
  }
  getCities(id: string): Observable<PaginationResult<Cities[]>> {
    const paginatedResult: PaginationResult<Cities[]> = new PaginationResult<Cities[]>();
    return this.http.get<Cities[]>(this.baseUrl + 'cityList/' + id, { observe: 'response'})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return  paginatedResult;
      })
    );
  }

}
