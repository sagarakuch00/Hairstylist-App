
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/api/api-constants.service';
import { ServiceSummary } from 'src/app/interfaces/service-summary';

@Injectable({
  providedIn: 'root',
})
export class ServiceQueryService {


  constructor(private http: HttpClient) {}

  getAllServices(): Observable<ServiceSummary[]> {
    return this.http.get<ServiceSummary[]>(`${API.services}`);
  }
}
