import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionRequest, Address, RequestStatus } from '../../models/collection-request.model';
import { updateCollectionRequest } from '../../store/collection/collection.actions';
import { CommonModule } from '@angular/common';
import { selectAllRequests } from '../../store/collection/collection.selectors';
import { AppState } from '../../store/app.state';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Tableau de bord collecteur</h2>
      
      <div *ngFor="let request of collectionRequests$ | async" 
           class="bg-white p-4 rounded-lg shadow mb-4">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-semibold">Adresse: {{getStreet(request.collectionAddress)}}</p>
            <p>Status: {{request.status}}</p>
            <p>Date: {{request.collectionDate | date}}</p>
          </div>
          
          <div class="space-x-2">
            <button *ngIf="request.status === 'en_attente'"
                    (click)="markAsOccupied(request.id)"
                    class="bg-blue-500 text-white px-4 py-2 rounded">
              Accepter la collecte
            </button>
            
            <button *ngIf="request.status === 'occupee'"
                    (click)="startCollection(request.id)"
                    class="bg-green-500 text-white px-4 py-2 rounded">
              Commencer la collecte
            </button>
            
            <button *ngIf="request.status === 'en_cours'"
                    (click)="openValidationModal(request)"
                    class="bg-yellow-500 text-white px-4 py-2 rounded">
              Valider sur place
            </button>
          </div>
        </div>
        
        <!-- Modal de validation sur place -->
        <div *ngIf="showValidationModal && selectedRequest?.id === request.id"
             class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-lg w-96">
            <h3 class="text-xl font-bold mb-4">Validation de la collecte</h3>
            
            <form [formGroup]="validationForm" (ngSubmit)="validateCollection(request.id)">
              <div class="mb-4">
                <label class="block mb-2">Poids réel (en grammes)</label>
                <input type="number" formControlName="validatedWeight"
                       class="w-full border rounded p-2">
              </div>
              
              <div class="mb-4">
                <label class="block mb-2">Type de matériaux vérifié</label>
                <select formControlName="verifiedType"
                        class="w-full border rounded p-2">
                  <option value="plastique">Plastique</option>
                  <option value="verre">Verre</option>
                  <option value="papier">Papier</option>
                  <option value="metal">Métal</option>
                </select>
              </div>
              
              <div class="mb-4">
                <label class="block mb-2">Photos de validation</label>
                <input type="file" (change)="onFileSelected($event)"
                       accept="image/*" multiple>
              </div>
              
              <div class="flex justify-end space-x-2">
                <button type="button"
                        (click)="closeValidationModal()"
                        class="bg-gray-500 text-white px-4 py-2 rounded">
                  Annuler
                </button>
                <button type="submit"
                        class="bg-green-500 text-white px-4 py-2 rounded">
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./collector-dashboard.component.css']
})
export class CollectorDashboardComponent implements OnInit {
  collectionRequests$: Observable<CollectionRequest[]>;
  validationForm: FormGroup;
  showValidationModal = false;
  selectedRequest: CollectionRequest | null = null;
  validationPhotos: string[] = [];

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder
  ) {
    this.validationForm = this.fb.group({
      validatedWeight: ['', [Validators.required, Validators.min(0)]],
      verifiedType: ['', Validators.required]
    });

    this.collectionRequests$ = this.store.select(selectAllRequests).pipe(
      map((requests: CollectionRequest[]) => {
        const collectorCity = this.getCurrentCollectorCity();
        return requests.filter(request => 
          request.collectionAddress.city.toLowerCase() === collectorCity.toLowerCase()
        );
      })
    );
  }

  ngOnInit(): void {}

  getCurrentCollectorCity(): string {
    const collector = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return collector.city || '';
  }

  getStreet(address: Address | string | undefined): string {
    if (!address) return 'Adresse non disponible';
    if (typeof address === 'string') return address;
    return address.street || 'Adresse non disponible';
  }

  onUpdateStatus(requestId: string, newStatus: RequestStatus): void {
    this.store.dispatch(updateCollectionRequest({ requestId, request: { status: newStatus } }));
  }

  acceptRequest(requestId: string | undefined): void {
    if (requestId) {
      this.store.dispatch(updateCollectionRequest({ 
        requestId, 
        request: { status: 'validee' } 
      }));
    }
  }

  rejectRequest(requestId: string | undefined): void {
    if (requestId) {
      this.store.dispatch(updateCollectionRequest({ 
        requestId, 
        request: { status: 'rejetee' } 
      }));
    }
  }

  markAsOccupied(requestId: string): void {
    this.store.dispatch(updateCollectionRequest({ 
      requestId, 
      request: { status: 'occupee' } 
    }));
  }

  startCollection(requestId: string): void {
    this.store.dispatch(updateCollectionRequest({ 
      requestId, 
      request: { status: 'en_cours' } 
    }));
  }

  validateCollection(requestId: string): void {
    if (this.validationForm.valid) {
      const validation = this.validationForm.value;
      this.store.dispatch(updateCollectionRequest({ 
        requestId, 
        request: { 
          status: 'validee' as RequestStatus,
          validatedWeight: validation.validatedWeight,
          verifiedType: validation.verifiedType,
          validationPhotos: this.validationPhotos
        } 
      }));
      this.closeValidationModal();
    }
  }

  openValidationModal(request: CollectionRequest): void {
    this.selectedRequest = request;
    this.showValidationModal = true;
  }

  closeValidationModal(): void {
    this.showValidationModal = false;
    this.selectedRequest = null;
    this.validationForm.reset();
    this.validationPhotos = [];
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.validationPhotos.push(e.target.result);
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  }
}
