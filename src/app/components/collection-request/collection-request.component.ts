import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createCollectionRequest } from '../../store/collection/collection.actions';
import { CollectionRequest } from '../../models/collection-request.model';

@Component({
  selector: 'app-collection-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collection-request.component.html',
  styleUrls: ['./collection-request.component.css']
})
export class CollectionRequestComponent implements OnInit {
  collectionRequestForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {
    this.collectionRequestForm = this.fb.group({
      wasteItems: this.fb.array([]),
      collectionAddress: ['', Validators.required],
      collectionDate: ['', Validators.required],
      timeSlot: ['', [Validators.required, this.timeSlotValidator]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.addWasteItem();
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
      const requestData: CollectionRequest = {
        ...this.collectionRequestForm.value,
        userId: 'currentUserId',
        status: 'en_attente',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.store.dispatch(createCollectionRequest({ request: requestData }));
    
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
}
