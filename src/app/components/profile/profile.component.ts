import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { updateProfile, deleteAccount } from '../../store/auth/auth.actions';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { DEFAULT_AVATAR_URL } from '../../shared/constants';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NavbarComponent, 
    FooterComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  profileForm: FormGroup;
  currentUser$ = this.store.select(selectCurrentUser);
  defaultAvatarUrl = DEFAULT_AVATAR_URL;
  updateSuccess = false;
  isSubmitting = false;
  imagePreview: string | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0[5-7][0-9]{8}$/)]],
      dateOfBirth: ['', [Validators.required]],
      profilePicture: [''],
      address: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(3)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        country: ['Maroc', Validators.required]
      })
    });

    this.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue(user);
        this.imagePreview = user.profilePicture || this.defaultAvatarUrl;
      }
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      this.updateSuccess = false;

      this.store.dispatch(updateProfile({ 
        userId: this.profileForm.value.id,
        userData: {
          ...this.profileForm.value,
          profilePicture: this.imagePreview
        }
      }));

      setTimeout(() => {
        this.isSubmitting = false;
        this.updateSuccess = true;
      }, 1000);
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB
        alert('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.profileForm.patchValue({ profilePicture: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onDeleteAccount(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.store.dispatch(deleteAccount({ userId: this.profileForm.value.id }));
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string, groupName?: string): string {
    const control = groupName ? 
      this.profileForm.get(groupName)?.get(controlName) : 
      this.profileForm.get(controlName);

    if (control?.errors) {
      if (control.errors['required']) return 'Ce champ est requis';
      if (control.errors['email']) return 'Email invalide';
      if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      if (control.errors['pattern']) {
        if (controlName === 'phoneNumber') return 'Format: 06XXXXXXXX ou 07XXXXXXXX';
        if (controlName === 'postalCode') return 'Code postal à 5 chiffres';
      }
    }
    return '';
  }
}

