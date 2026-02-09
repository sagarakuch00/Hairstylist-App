import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/api/api-constants.service';
import { Batch } from 'src/app/interfaces/Batch';
import { CreateBatchDto } from 'src/app/interfaces/dto/create-batch';
import { UpdateBatchDto } from 'src/app/interfaces/dto/update-batch';

@Injectable({
  providedIn: 'root',
})
export class BatchManageService {
  constructor(private http: HttpClient) {}

  
  createBatch(payload: CreateBatchDto) {
  return this.http.post(API.batchesManage, payload);
}

  
  getBatchById(id: string): Observable<Batch> {
    return this.http.get<Batch>(`${API.batches}/${id}`);
  }

  
  updateBatch(batchId: string, payload: any) {
    return this.http.put(`${API.batchesManage}/${batchId}`, payload);
  }

 
  deleteBatch(batchId: string): Observable<any> {
    return this.http.delete(`${API.batchesManage}/${batchId}`);
  }
}
