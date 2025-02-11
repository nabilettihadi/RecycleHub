import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionRequestService } from '../../services/collection-request.service';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-collection-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './collection-request.component.html'
})
export class CollectionRequestComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store<AppState>);
  private collectionRequestService = inject(CollectionRequestService);
  private router = inject(Router);

  collectionRequestForm!: FormGroup;
  currentUser$ = this.store.select(selectCurrentUser);
  errorMessage = '';
  isSubmitting = false;
  today = new Date().toISOString().split('T')[0];

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.collectionRequestForm = this.fb.group({
      wasteItems: this.fb.array([]),
      collectionAddress: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(3)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        country: ['Maroc']
      }),
      collectionDate: ['', [Validators.required]],
      timeSlot: ['', [Validators.required]],
      notes: ['', Validators.maxLength(500)],
      totalWeight: [0, [Validators.required, Validators.max(10000)]]
    });
  }

  ngOnInit(): void {
    this.addWasteItem();
  }

  get wasteItems(): FormArray {
    return this.collectionRequestForm.get('wasteItems') as FormArray;
  }

  addWasteItem(): void {
    const item = this.fb.group({
      weight: ['', [Validators.required, Validators.min(1000), Validators.max(10000)]],
      type: ['', Validators.required],
      photos: [[]]
    });
    this.wasteItems.push(item);
    this.updateTotalWeight();
  }

  removeWasteItem(index: number): void {
    if (this.wasteItems.length > 1) {
      this.wasteItems.removeAt(index);
    }
  }

  updateTotalWeight(): void {
    const totalWeight = this.wasteItems.controls.reduce((total, item) => {
      return total + (item.get('weight')?.value || 0);
    }, 0);
    this.collectionRequestForm.get('totalWeight')?.setValue(totalWeight);
  }

  onSubmit(): void {
    if (this.collectionRequestForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const validationError = this.collectionRequestService.validateRequest(
        this.collectionRequestForm.value
      );

      if (validationError) {
        this.errorMessage = validationError;
        this.isSubmitting = false;
        return;
      }

      this.currentUser$.pipe(first()).subscribe({
        next: (user) => {
          if (!user) {
            this.errorMessage = 'Utilisateur non connecté';
            this.isSubmitting = false;
            return;
          }

          try {
            this.collectionRequestService.createRequest(
              this.collectionRequestForm.value,
              user.id
            );
            
            this.collectionRequestForm.reset({
              collectionAddress: { country: 'Maroc' }
            });
            this.wasteItems.clear();
            this.addWasteItem();
            
            // Rediriger vers le dashboard
            this.router.navigate(['/dashboard']);
          } catch (error: any) {
            this.errorMessage = error.message;
          } finally {
            this.isSubmitting = false;
          }
        },
        error: (error: any) => {
          this.errorMessage = 'Erreur lors de la récupération des informations utilisateur';
          this.isSubmitting = false;
        }
      });
    } else {
      this.updateTotalWeight();
      this.markFormGroupTouched(this.collectionRequestForm);
    }
  }

  onFileSelected(event: any, index: number): void {
    const files = event.target.files;
    if (files) {
      const photos: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          photos.push(e.target.result);
          if (i === files.length - 1) {
            const wasteItem = this.wasteItems.at(index);
            wasteItem.patchValue({ photos });
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
