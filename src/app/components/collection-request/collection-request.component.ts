import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createCollectionRequest } from '../../store/collection/collection.actions';
import { CollectionRequest } from '../../models/collection-request.model';
import { selectUserActiveRequests, selectCurrentUser } from '../../store/auth/auth.selectors';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-collection-request',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './collection-request.component.html',
  styleUrls: ['./collection-request.component.css']
})
export class CollectionRequestComponent implements OnInit {
  private store = inject(Store<AppState>);
  private fb = inject(FormBuilder);

  collectionRequestForm: FormGroup;
  errorMessage: string = '';
  activeRequests$!: Observable<string[]>;
  currentUser$ = this.store.select(selectCurrentUser);
  today = new Date().toISOString().split('T')[0];
  isSubmitting = false;

  constructor() {
    this.collectionRequestForm = this.fb.group({
      wasteItems: this.fb.array([]),
      collectionAddress: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(3)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        postalCode: ['', [
          Validators.required, 
          Validators.pattern(/^\d{5}$/) // Validate 5-digit postal code
        ]],
        country: ['Maroc', Validators.required]
      }),
      collectionDate: ['', [Validators.required, this.futureDateValidator]],
      timeSlot: ['', [Validators.required, this.timeSlotValidator]],
      notes: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.addWasteItem();
    this.activeRequests$ = this.store.select(selectUserActiveRequests);
  }

  get wasteItems(): FormArray {
    return this.collectionRequestForm.get('wasteItems') as FormArray;
  }

  addWasteItem(): void {
    const wasteItem = this.fb.group({
      type: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(1000)]],
      photos: [[]]
    });
    this.wasteItems.push(wasteItem);
  }

  removeWasteItem(index: number): void {
    if (this.wasteItems.length > 1) {
      this.wasteItems.removeAt(index);
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

  private maxRequests = 3; // Maximum simultaneous requests
  private totalWeightLimit = 10; // Maximum total weight in kg

  timeSlotValidator(control: any): { [key: string]: boolean } | null {
    // Implement your validation logic here
    return null; // Return null if valid, or an object if invalid
  }

  futureDateValidator(control: AbstractControl): {[key: string]: any} | null {
    const currentDate = new Date();
    const inputDate = new Date(control.value);
    return inputDate > currentDate ? null : { 'pastDate': true };
  }

  getCurrentRequests(): number {
    // Implement logic to return the current number of requests
    return this.wasteItems.length; // Example implementation
  }

  calculateTotalWeight(): number {
    return this.wasteItems.controls.reduce((total, item) => {
      const weight = item.get('weight')?.value || 0;
      return total + weight;
    }, 0);
  }

  onSubmit(): void {
    const currentRequests = this.getCurrentRequests(); // Method to get current requests count
    const totalWeight = this.calculateTotalWeight(); // Method to calculate total weight of current request

    if (currentRequests >= this.maxRequests) {
      // Handle maximum requests error
      return;
    }

    if (totalWeight > this.totalWeightLimit) {
      // Handle total weight error
      return;
    }
    if (this.collectionRequestForm.valid) {
      const formValue = this.collectionRequestForm.value;
      const collectionRequest: CollectionRequest = {
        id: '', // Generate or get from backend
        userId: '', // Get from current user
        wasteItems: formValue.wasteItems,
        collectionAddress: formValue.collectionAddress,
        collectionDate: formValue.collectionDate,
        timeSlot: formValue.timeSlot,
        status: 'en_attente',
        createdAt: new Date(),
        updatedAt: new Date(),
        totalWeight: this.calculateTotalWeight()
      };

      this.store.dispatch(createCollectionRequest({ request: collectionRequest }));
    
    this.collectionRequestForm.reset();
    this.addWasteItem();

    } else {
      Object.keys(this.collectionRequestForm.controls).forEach(key => {
        const control = this.collectionRequestForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  private validateRequestLimit(): boolean {
    const currentRequests = this.getCurrentRequests();
    if (currentRequests >= 3) {
      this.errorMessage = 'Vous avez atteint la limite de 3 demandes simultanées';
      return false;
    }
    return true;
  }

  private validateTotalWeight(): boolean {
    const totalWeight = this.calculateTotalWeight();
    if (totalWeight > 10000) { // 10kg en grammes
      this.errorMessage = 'Le poids total ne peut pas dépasser 10kg';
      return false;
    }
    return true;
  }

  private validateRequest(): boolean {
    let isValid = true;

    // Utiliser first() pour obtenir la valeur actuelle de l'Observable
    this.activeRequests$.pipe(
      first()
    ).subscribe(requests => {
      if (requests.length >= 3) {
        this.errorMessage = 'Vous ne pouvez pas avoir plus de 3 demandes actives';
        isValid = false;
      }
    });

    // Vérifier le poids total
    const totalWeight = this.calculateTotalWeight();
    if (totalWeight > 10000) { // 10kg en grammes
      this.errorMessage = 'Le poids total ne peut pas dépasser 10kg';
      return false;
    }

    // Vérifier le poids minimum par déchet
    const invalidItems = this.wasteItems.controls.some(
      item => item.get('weight')?.value < 1000
    );
    if (invalidItems) {
      this.errorMessage = 'Chaque déchet doit peser au minimum 1kg';
      return false;
    }

    return isValid;
  }
}
