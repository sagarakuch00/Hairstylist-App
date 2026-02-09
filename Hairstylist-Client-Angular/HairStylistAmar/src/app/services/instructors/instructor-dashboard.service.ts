
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/api/api-constants.service';

export interface InstructorDashboardSummary {
  totalStudents: number;
  totalEarnings: number;
}

@Injectable({
  providedIn: 'root'
})
export class InstructorDashboardService {

  constructor(private http: HttpClient) {}

  
  getDashboardSummary(): Observable<InstructorDashboardSummary> {
    return this.http.get<InstructorDashboardSummary>(
      `${API.instructorDashboard}/summary`
    );
  }

 
  getBatchWiseStats(): Observable<any[]> {
    return this.http.get<any[]>(
      `${API.instructorDashboard}/batchwise`
    );
  }

}
