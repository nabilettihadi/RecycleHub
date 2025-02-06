import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^0[5-7][0-9]{8}$/)]],
      birthDate: ['', Validators.required]
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
      phone: this.currentUser.phone,
      birthDate: this.currentUser.birthDate
    });
  }

  onSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      const updatedUser: User = {
        ...this.currentUser,
        ...this.profileForm.value
      };
      this.authService.updateUser(updatedUser);
    }
  }

  deleteAccount() {
    if (this.currentUser && confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.authService.deleteAccount(this.currentUser.email).subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
  }
}
