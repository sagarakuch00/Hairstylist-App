import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceManageService } from 'src/app/services/services/service-manage.service';
import { CreateServiceRequest } from 'src/app/interfaces/create-service-request';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.css']
})
export class CreateServiceComponent implements OnInit {

  serviceId: string | null = null;
  isEditMode = false;
  loading = false;

  model: CreateServiceRequest = {
    name: '',
    description: '',
    price: 0
  };

  
  showSuccessPopup = false;
  showErrorPopup = false;
  errorMessage = 'Something went wrong. Please try again.';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceApi: ServiceManageService
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.serviceId;
  }

  submit() {
    if (!this.model.name || this.model.price <= 0) {
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.serviceId) {
      this.serviceApi.updateService(this.serviceId, this.model)
        .subscribe({
          next: () => {
            this.loading = false;
            this.showSuccessPopup = true;

            setTimeout(() => {
              this.showSuccessPopup = false;
              this.router.navigate(['/instructor/services']);
            }, 1800);
          },
          error: (err) => {
            this.loading = false;
            this.showErrorPopup = true;
            this.errorMessage = err?.error || 'Failed to update service.';
          }
        });
    } else {
      this.serviceApi.createService(this.model)
        .subscribe({
          next: () => {
            this.loading = false;
            this.showSuccessPopup = true;

            setTimeout(() => {
              this.showSuccessPopup = false;
              this.router.navigate(['/instructor/dashboard']);
            }, 1800);
          },
          error: (err) => {
            this.loading = false;
            this.showErrorPopup = true;
            this.errorMessage = err?.error || 'Failed to create service.';
          }
        });
    }
  }

  cancel() {
    this.router.navigate(['/instructor/services']);
  }

  
  closeErrorPopup(): void {
    this.showErrorPopup = false;
  }
}
