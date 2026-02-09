import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API, API_BASE } from 'src/app/core/api/api-constants.service';
import { InstructorProfile } from 'src/app/interfaces/instructor-profile';
import { UpdateInstructorProfileDto } from 'src/app/interfaces/update-instructor-profile-dto';



@Injectable({
  providedIn: 'root'
})
export class InstructorProfileService {

  API: string = API_BASE;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<InstructorProfile> {
    return this.http.get<InstructorProfile>(
      `${API.instructorProfile}/me`
    );
  }


  uploadPhoto(formData: FormData) {
  return this.http.post(
    `${API.instructorProfile}/upload-photo`,
    formData
  );
}

updateMyProfile(profile: UpdateInstructorProfileDto) {
  return this.http.put<void>(
    `${this.API}/instructor/profile/me`,
    profile
  );
}




}

export { InstructorProfile };

