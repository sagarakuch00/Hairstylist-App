import { Component, OnInit } from '@angular/core';
import {
  InstructorProfile,
  InstructorProfileService
} from 'src/app/services/instructors/instructor-profile.service';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class InstructorProfileComponent implements OnInit {

  FILE_BASE = 'https://localhost:7154';
  profile!: InstructorProfile;
  loading = true;
  editMode = false;

  
  showPopup = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';

  constructor(private profileApi: InstructorProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

 
  loadProfile(): void {
    this.profileApi.getMyProfile().subscribe({
      next: res => {
        this.profile = res;
        this.loading = false;
      },
      error: err => {
        console.error('Profile load failed', err);
        this.loading = false;
        this.openPopup('Failed to load profile', 'error');
      }
    });
  }


 saveProfile(): void {

 
  if (this.profile.mobile && this.profile.mobile.length !== 10) {
    this.openPopup('Mobile number must be exactly 10 digits', 'error');
    return;
  }

  this.profileApi.updateMyProfile(this.profile).subscribe({
    next: () => {
      this.editMode = false;
      this.openPopup('Profile updated successfully', 'success');
    },
    error: () => {
      this.openPopup('Profile update failed', 'error');
    }
  });
}


  
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.openPopup('Please select a valid image file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.profileApi.uploadPhoto(formData).subscribe({
      next: (res: any) => {
        this.profile.photoUrl = res.photoUrl + '?v=' + Date.now(); 
        this.openPopup('Profile photo updated successfully', 'success');
      },
      error: () => {
        this.openPopup('Photo upload failed', 'error');
      }
    });
  }

  
  openPopup(message: string, type: 'success' | 'error'): void {
    this.popupMessage = message;
    this.popupType = type;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }
}
