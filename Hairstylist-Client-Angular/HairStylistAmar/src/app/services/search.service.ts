import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private API_BASE = 'https://localhost:7154/api/search';

  
  private searchCache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  
  search(query: string): Observable<any> {
    const normalizedQuery = query.trim().toLowerCase();

   
    if (this.searchCache.has(normalizedQuery)) {
      return of(this.searchCache.get(normalizedQuery));
    }

    
    return this.http.get<any>(`${this.API_BASE}?query=${normalizedQuery}`).pipe(
      tap(result => {
        this.searchCache.set(normalizedQuery, result);
      })
    );
  }

 
  clearCache(): void {
    this.searchCache.clear();
  }
}
