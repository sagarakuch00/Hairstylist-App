// src/app/services/batches/batch-query.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/core/api/api-constants.service';
import { Observable } from 'rxjs';
import { Batch } from 'src/app/interfaces/Batch';

@Injectable({
  providedIn: 'root',
})
export class BatchQueryService {
  constructor(private http: HttpClient) {}

  
  getAllBatches(serviceId: string): Observable<Batch[]> {
  return this.http.get<Batch[]>(`${API.batches}/service/${serviceId}`);
}

  
  getBatchesByInstructor(instructorId: string): Observable<any> {
    return this.http.get(`${API.batches}/instructor/${instructorId}`);
  }

  getAllServices(): Observable<any> {
    return this.http.get(`${API.services}`);
  }
  
}
