
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API } from 'src/app/core/api/api-constants.service';
import { UserProfile } from 'src/app/interfaces/user-profile';

@Injectable({ providedIn: 'root' })
export class UserProfileService {

  
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);

  constructor(private http: HttpClient) {}

  
  getProfile(): Observable<UserProfile> {
    if (this.profileSubject.value) {
      return of(this.profileSubject.value);
    }

    return this.http.get<UserProfile>(API.userProfile).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }

  
  refreshProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(API.userProfile).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }

  
  updateProfile(data: UserProfile): Observable<void> {
    return this.http.put<void>(API.userProfile, data).pipe(
      tap(() => {
       
        this.refreshProfile().subscribe();
      })
    );
  }

  
  uploadPhoto(formData: FormData): Observable<{ photoUrl: string }> {
    return this.http.post<{ photoUrl: string }>(
      `${API.userProfile}/photo`,
      formData
    ).pipe(
      tap(() => {
        
        this.refreshProfile().subscribe();
      })
    );
  }

  
  clearCache(): void {
    this.profileSubject.next(null);
  }
}
