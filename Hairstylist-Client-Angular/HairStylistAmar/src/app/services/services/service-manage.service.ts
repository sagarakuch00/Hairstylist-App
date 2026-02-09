
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/api/api-constants.service';
import { CreateServiceRequest } from 'src/app/interfaces/create-service-request';

@Injectable({
  providedIn: 'root'
})
export class ServiceManageService {

  constructor(private http: HttpClient) {}

  createService(request: CreateServiceRequest): Observable<any> {
    return this.http.post(
      `${API.services}/manage`,
      request
    );
  }

  updateService(id: string, request: CreateServiceRequest): Observable<void> {
    return this.http.put<void>(
      `${API.services}/manage/${id}`,
      request
    );
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(
      `${API.services}/manage/${id}`
    );
  }
}
