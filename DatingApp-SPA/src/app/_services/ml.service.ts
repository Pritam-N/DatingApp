import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MlService {

  baseUrl = '';

  constructor(private http: HttpClient) {
    this.baseUrl = environment.mlUrl;
  }

  getSuggestion(text: string) {
    // const body = new URLSearchParams();
    // body.set('text', text);

    // const options = {
    //   headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    // };

    return this.http.get(this.baseUrl + 'SentenceComplete' + '?text=' + text);
  }
}
