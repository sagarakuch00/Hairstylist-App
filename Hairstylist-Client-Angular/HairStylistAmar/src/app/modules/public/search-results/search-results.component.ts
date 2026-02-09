import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  query = '';

  services: any[] = [];
  instructors: any[] = [];
  batches: any[] = [];

  loading = true;

  
  showLoginPopup = false;
  pendingRedirect = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const newQuery = params['q'];

      if (newQuery && newQuery !== this.query) {
        this.query = newQuery;
        this.search();
      }
    });
  }

  search(): void {
    this.loading = true;

    
    this.services = [];
    this.instructors = [];
    this.batches = [];

    this.searchService.search(this.query).subscribe({
      next: (res) => {
        this.services = res.services || [];
        this.instructors = res.instructors || [];
        this.batches = res.batches || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  
  goToInstructor(instructor: any): void {
    this.router.navigate(['/public/instructor', instructor.instructorId]);
  }

 
  goToService(service: any): void {
    this.router.navigate(['/search-results'], {
      queryParams: { q: service.name }
    });
  }

  
  onBook(batch: any): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.pendingRedirect = '/search-results?q=' + this.query;
      this.showLoginPopup = true;
      return;
    }

    this.router.navigate(['/user/book-batch'], {
      state: { batch }
    });
  }

  
  goToLogin(): void {
    this.showLoginPopup = false;

    this.router.navigate(['/auth/login'], {
      queryParams: { redirect: this.pendingRedirect }
    });
  }
}
