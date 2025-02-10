import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { selectCurrentRequest } from '../../store/collection/collection.selectors';

@Component({
  selector: 'app-collection-validation',
  template: `
    <div class="container mx-auto p-4" *ngIf="request$ | async as request">
      <h2>Validation de la collecte</h2>
      
      <form [formGroup]="validationForm" (ngSubmit)="onSubmit()">
        <div *ngFor="let item of request.wasteItems; let i = index">
          <h3>{{item.type}}</h3>
          <div class="form-group">
            <label>Poids validé (kg)</label>
            <input type="number" [formControlName]="'weight_'+i" class="form-control">
          </div>
          <div class="form-group">
            <label>Photos de validation</label>
            <input type="file" (change)="onFileSelected($event, i)" multiple>
          </div>
        </div>
        
        <button type="submit" class="btn btn-success">
          Valider la collecte
        </button>
      </form>
    </div>
  `
})
export class CollectionValidationComponent {
  request$ = this.store.select(selectCurrentRequest);
  validationForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.validationForm = this.fb.group({});
    this.request$.pipe(take(1)).subscribe(request => {
      request?.wasteItems.forEach((_, index) => {
        this.validationForm.addControl(`weight_${index}`, this.fb.control('', Validators.required));
      });
    });
  }
  
  onSubmit(): void {
    if (this.validationForm.valid) {
      // Dispatch action to validate collection
    }
  }
} 