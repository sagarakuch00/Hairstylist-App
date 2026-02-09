import { Component, OnInit } from '@angular/core';
import { UserProfileService } from
  'src/app/services/users/user-profile.service';
import { UserProfile } from
  'src/app/interfaces/user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  API_BASE = 'https://localhost:7154';
  profile!: UserProfile;
  loading = true;
  editMode = false;
  uploadingPhoto = false;

  showPopup = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'error';

  constructor(private profileApi: UserProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }


  loadProfile(): void {
    this.profileApi.getProfile().subscribe({
      next: (res: any) => {
        this.profile = {
          ...res,
          
          mobile: res.mobile ?? res.mobileNumber ?? res.MobileNumber
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Profile load failed', err);
        this.loading = false;
        this.openPopup('Failed to load profile', 'error');
      }
    });
  }

  // 🔹 Save profile
  saveProfile(): void {
    if (this.profile.mobile && this.profile.mobile.length !== 10) {
      this.openPopup('Mobile number must be exactly 10 digits', 'error');
      return;
    }

    this.profileApi.updateProfile(this.profile).subscribe({
      next: () => {
        this.editMode = false;
        this.openPopup('Profile updated successfully', 'success');
      },
      error: err => {
        console.error(err);
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

    if (file.size > 2 * 1024 * 1024) {
      this.openPopup('Image size must be under 2MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.profileApi.uploadPhoto(formData).subscribe({
      next: (res: any) => {
        this.profile.photoUrl = res.photoUrl + '?v=' + Date.now();
        this.openPopup('Profile photo updated', 'success');
      },
      error: () => this.openPopup('Photo upload failed', 'error')
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

  allowOnlyDigits(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
