import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createCollectionRequest } from '../../store/collection/collection.actions';
import { CollectionRequest } from '../../models/collection-request.model';

@Component({
  selector: 'app-collection-request',
  templateUrl: './collection-request.component.html',
  styleUrls: ['./collection-request.component.css']
})
export class CollectionRequestComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  
  collectionRequestForm: FormGroup;

  constructor() {
    this.collectionRequestForm = this.fb.group({
      wasteItems: this.fb.array([]),
      totalWeight: [0, [Validators.required, Validators.min(1)]],
      collectionAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
      collectionDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.collectionRequestForm.valid) {
      const requestData: CollectionRequest = {
        ...this.collectionRequestForm.value,
        userId: 'currentUserId', // Replace with actual user ID
        status: 'en_attente',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.store.dispatch(createCollectionRequest({ request: requestData }));
    }
  }
}
