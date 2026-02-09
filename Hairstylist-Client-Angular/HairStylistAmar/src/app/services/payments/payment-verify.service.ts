

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/core/api/api-constants.service';


@Injectable({ providedIn: 'root' })
export class PaymentVerifyService {

  constructor(private http: HttpClient) {}

  verifyPayment(data: any) {
   
    return this.http.post(API.verifyPayment, data);
  }
}
