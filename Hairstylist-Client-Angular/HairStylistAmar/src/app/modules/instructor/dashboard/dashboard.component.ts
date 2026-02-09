import { Component, OnInit } from '@angular/core';
import {
  InstructorDashboardService,
  InstructorDashboardSummary
} from '../../../services/instructors/instructor-dashboard.service';

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {

  summary!: InstructorDashboardSummary;
  loading = true;

  constructor(
    private dashboardApi: InstructorDashboardService
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.dashboardApi.getDashboardSummary().subscribe({
      next: res => {
        this.summary = res;
        this.loading = false;
      },
      error: err => {
        console.error('Dashboard summary error', err);
        this.loading = false;
      }
    });
  }
}
