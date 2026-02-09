
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/core/api/api-constants.service';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get(API.users);
  }
}
