import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isUpdating = false;
  updateSuccess = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0[5-7][0-9]{8}$/)]],
      dateOfBirth: ['', Validators.required],
      profilePicture: ['']
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileForm.patchValue({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      address: this.currentUser.address,
      phoneNumber: this.currentUser.phoneNumber,
      dateOfBirth: this.currentUser.dateOfBirth,
      profilePicture: this.currentUser.profilePicture
    });
  }

  onSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      this.isUpdating = true;
      this.updateSuccess = false;

      const updatedUser: Partial<User> = {
        ...this.profileForm.value
      };

      this.authService.updateProfile(this.currentUser.id!, updatedUser).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.isUpdating = false;
          this.updateSuccess = true;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.isUpdating = false;
        }
      });
    }
  }

  onDeleteAccount() {
    if (this.currentUser && confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.authService.deleteAccount(this.currentUser.id!).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error deleting account:', error);
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.currentUser) {
          const profilePicture = e.target.result;
          this.profileForm.patchValue({ profilePicture });
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
