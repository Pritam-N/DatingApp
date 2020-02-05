import { Injectable } from '@angular/core';
import * as alertyfy from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  confirm(message: string, okCallback: () => any) {
    alertyfy.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      } else {}
    });
  }

  success(message: string) {
    alertyfy.success(message);
  }

  error(message: string) {
    alertyfy.error(message);
  }

  warning(message: string) {
    alertyfy.warning(message);
  }

  message(message: string) {
    alertyfy.message(message);
  }

}
