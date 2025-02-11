import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models';
import { ProfileService } from '../../services/profile.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectSignedInUser } from '../../../modules/auth/state/auth.selectors';
import { logout, profileUpdated } from '../../../modules/auth/state/auth.actions';
import { AuthService } from '../../../core/auth/service/auth.service';
import { ConfirmationModalComponent } from '../../ui/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, ConfirmationModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  profileForm: FormGroup;
  currentUser: User | null = null;
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private store = inject(Store);
  private router = inject(Router);

  shownSuccessMsg = signal(false);
  showDeleteModal = signal(false);

  constructor() {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      password: [''],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.store.select(selectSignedInUser).subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          password: '',
          address: user.address,
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      const updates: Partial<User> = {
        password: this.profileForm.get('password')?.value || this.currentUser.password,
        address: this.profileForm.get('address')?.value,
      };

      this.profileService.updateProfile(this.currentUser.id!, updates).subscribe({
        next: (updatedUser) => {
          this.store.dispatch(profileUpdated({ user: updatedUser }));
          this.authService.setLoggedInUser(updatedUser);
          this.shownSuccessMsg.set(true);
          setTimeout(() => {
            this.shownSuccessMsg.set(false);
          }, 2500);
        },
        error: (error) => console.error('Error updating profile:', error),
      });
    }
  }

  onDeleteAccount() {
    this.showDeleteModal.set(true); 
  }

  confirmDeleteAccount() {
    if (this.currentUser) {
      this.profileService.deleteAccount(this.currentUser.id!).subscribe({
        next: () => {
          localStorage.clear();
          this.store.dispatch(logout());
          this.router.navigate(['/']);
        },
        error: (error) => console.error('Error deleting account:', error),
      });
    }
  }

  cancelDeleteAccount() {
    this.showDeleteModal.set(false);
  }
}
