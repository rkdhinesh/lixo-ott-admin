import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class LogService {

  info(msg: any) {
    if (!environment.production) {
      console.log(msg);
    }

  }

  warn(msg: any) {
    console.warn(msg);
  }

  error(msg: any) {
    console.error(msg);
  }

}