import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionRequestService } from '../../services/collection-request.service';
import { WasteType } from '../../models/collection-request.model';

@Component({
  selector: 'app-collection-validation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `<!-- template existant -->`,
})
export class CollectionValidationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private collectionService = inject(CollectionRequestService);

  validationForm: FormGroup;
  validationPhotos: string[] = [];
  requestId: string = '';

  constructor() {
    this.validationForm = this.fb.group({
      validatedWeight: ['', [Validators.required, Validators.min(1000)]],
      verifiedType: ['', Validators.required],
      validationPhotos: [[]]
    });
  }

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.requestId) {
      this.router.navigate(['/collector-dashboard']);
    }
  }

  onSubmit(): void {
    if (this.validationForm.valid && this.requestId) {
      const formValue = this.validationForm.value;
      
      // Valider la collecte
      this.collectionService.validateCollection(this.requestId);
      
      // Rediriger vers le tableau de bord
      this.router.navigate(['/collector-dashboard']);
    }
  }

  // ... reste du code ...
} 