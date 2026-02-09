import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchManageService } from 'src/app/services/batches/batch-manage.service';
import { ServiceQueryService } from 'src/app/services/services/service-query.service';

@Component({
  selector: 'app-edit-batch',
  templateUrl: '../create-batch/create-batch.component.html',
  styleUrls: ['../create-batch/create-batch.component.css']
})
export class EditBatchComponent implements OnInit {

  batchId = '';

  batchName = '';
  description = '';
  price = 0;
  totalSeats = 0;
  startDate = '';
  serviceId = '';
  mobileNumber = '';

 
showSuccessPopup: boolean = false;
showErrorPopup: boolean = false;
errorMessage: string = '';

  minStartDate = '';
  services: any[] = [];
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private batchManageService: BatchManageService,
    private serviceQueryService: ServiceQueryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('batchId')!;
    this.setMinStartDate();
    this.fetchServices();
    this.loadBatchDetails();
  }

  loadBatchDetails(): void {
    this.batchManageService.getBatchById(this.batchId).subscribe({
      next: (batch) => {
        this.batchName = batch.batchName;
        this.description = batch.description;
        this.price = batch.price;
        this.totalSeats = batch.totalSeats;
        this.startDate = batch.startDate?.split('T')[0];
        this.serviceId = batch.serviceId;
        this.mobileNumber = batch.mobileNumber;
      },
      error: () => {
        this.router.navigate(['/instructor/batches']);
      }
    });
  }

submitBatch(): void {
  if (this.isSubmitting) return;

  const payload = {
    batchName: this.batchName,
    description: this.description,
    price: this.price,
    totalSeats: this.totalSeats,  
    startDate: this.startDate,
    serviceId: this.serviceId,
    mobileNumber: this.mobileNumber         
  };

  this.isSubmitting = true;

  this.batchManageService
    .updateBatch(this.batchId, payload)
    .subscribe({
      next: () => {
        this.router.navigate(['/instructor/batches']);
      },
      error: (err) => {
        console.error('Update failed', err);
        this.isSubmitting = false;
      }
    });
}



closeErrorPopup(): void {
  this.showErrorPopup = false;
}



  setMinStartDate(): void {
    const today = new Date();
    this.minStartDate = today.toISOString().split('T')[0];
  }

  fetchServices(): void {
    this.serviceQueryService.getAllServices().subscribe({
      next: (services) => (this.services = services),
      error: () => {}
    });
  }
}
