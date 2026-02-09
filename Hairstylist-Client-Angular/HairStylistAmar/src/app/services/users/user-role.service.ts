
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/core/api/api-constants.service';

@Injectable({ providedIn: 'root' })
export class UserRoleService {
  constructor(private http: HttpClient) {}

  setMyRole(role: string) {
    return this.http.post(`${API.userRole}`, role);
  }
}
