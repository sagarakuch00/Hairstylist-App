import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/core/api/api-constants.service';

export interface SetRoleRequest {
  role: 'User' | 'Instructor';
  mobileNumber?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {

  constructor(private http: HttpClient) {}


googleLogin(payload: {
  idToken: string;
  role: 'User' | 'Instructor';
  mobileNumber?: string;
}) {
  return this.http.post<any>(
    'https://localhost:7154/api/auth/google-login',
    payload
  );
}
}
 