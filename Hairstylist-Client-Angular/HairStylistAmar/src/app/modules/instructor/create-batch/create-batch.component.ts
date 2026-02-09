import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BatchManageService } from 'src/app/services/batches/batch-manage.service';
import { ServiceQueryService } from 'src/app/services/services/service-query.service';
import { CreateBatchDto } from 'src/app/interfaces/dto/create-batch';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.css'],
})
export class CreateBatchComponent implements OnInit {

  batchId: null = null;

  batchName = '';
  description = '';
  price = 0;
  startDate = '';
  serviceId = '';
  totalSeats = 0;
  mobileNumber = '';
  minStartDate = '';

   
  showSuccessPopup : boolean = false;
  showErrorPopup : boolean = false;
  errorMessage : string = 'Batch creation failed. Please try again.';

  services: any[] = [];
  isSubmitting = false;

 


  constructor(
    private batchManageService: BatchManageService,
    private serviceQueryService: ServiceQueryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setMinStartDate();
    this.fetchServices();
  }

  setMinStartDate(): void {
    const today = new Date();
    this.minStartDate = today.toISOString().split('T')[0];
  }

  fetchServices(): void {
    this.serviceQueryService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: () => {
        this.showErrorPopup = true;
        this.errorMessage = 'Unable to load services.';
      },
    });
  }

  submitBatch(): void {
    if (this.isSubmitting) return;

    const payload: CreateBatchDto = {
      batchName: this.batchName,
      description: this.description,
      price: this.price,
      totalSeats: this.totalSeats,
      availableSeats: this.totalSeats,
      startDate: this.startDate,
      serviceId: this.serviceId,
      mobileNumber: this.mobileNumber,
    };

    this.isSubmitting = true;

    this.batchManageService.createBatch(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showSuccessPopup = true;

        setTimeout(() => {
          this.showSuccessPopup = false;
          this.router.navigate(['/instructor/batches']);
        }, 1800);
      },
      error: (error) => {
        console.error('Batch creation failed', error);
        this.isSubmitting = false;
        this.showErrorPopup = true;
        this.errorMessage =
          error?.error || 'Batch creation failed. Please try again.';
      },
    });
  }

  closeErrorPopup(): void {
    this.showErrorPopup = false;
  }
}
