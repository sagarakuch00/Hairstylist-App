import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstructorDashboardService } from
  '../../../services/instructors/instructor-dashboard.service';
import { BatchManageService } from
  'src/app/services/batches/batch-manage.service';

@Component({
  selector: 'app-instructor-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class InstructorBatchesComponent implements OnInit {

  batches: any[] = [];
  loading = true;

  selectedBatch: any = null;


  showDeletePopup = false;

  constructor(
    private batchManage: BatchManageService,
    private dashboardApi: InstructorDashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBatchWiseStats();
  }

  loadBatchWiseStats(): void {
    
    this.dashboardApi.getBatchWiseStats().subscribe({
      next: res => {
        this.batches = res;
        this.loading = false;
      },
      error: err => {
        console.error('Batch-wise stats error', err);
        this.loading = false;
      }
    });
  }

 
  openBatchPopup(batch: any): void {
    this.selectedBatch = batch;
  }

  closePopup(): void {
    this.selectedBatch = null;
    this.showDeletePopup = false;
  }


  editBatch(): void {
    if (!this.selectedBatch) return;

    const batchId = this.selectedBatch.batchId;
    this.closePopup();

    this.router.navigate(['/instructor/edit-batch', batchId]);
  }

  
  confirmDelete(): void {
    this.showDeletePopup = true;
  }

  
  deleteBatch(): void {
    if (!this.selectedBatch) return;

    this.batchManage.deleteBatch(this.selectedBatch.batchId).subscribe({
      next: () => {
        this.closePopup();
        this.loadBatchWiseStats();
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
