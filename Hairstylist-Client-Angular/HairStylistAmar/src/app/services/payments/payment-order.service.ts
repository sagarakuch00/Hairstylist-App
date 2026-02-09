
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/core/api/api-constants.service';

@Injectable({ providedIn: 'root' })
export class PaymentOrderService {

  constructor(private http: HttpClient) {}

  createOrder(data: any) {
    return this.http.post(`${API.payments}/create-order`, data);
  }
}
