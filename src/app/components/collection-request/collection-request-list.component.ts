@Component({
  selector: 'app-collection-request-list',
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Mes demandes de collecte</h2>
      
      <div *ngFor="let request of pendingRequests$ | async" class="mb-4 p-4 border rounded">
        <div class="flex justify-between items-center">
          <div>
            <p>Date: {{request.collectionDate | date}}</p>
            <p>Status: {{request.status}}</p>
            <p>Poids total: {{request.totalWeight}}kg</p>
          </div>
          
          <div *ngIf="request.status === 'en_attente'">
            <button (click)="onEdit(request)" class="btn btn-primary mr-2">
              Modifier
            </button>
            <button (click)="onDelete(request.id)" class="btn btn-danger">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CollectionRequestListComponent {
  pendingRequests$ = this.store.select(selectUserPendingRequests);
  
  constructor(private store: Store) {}
  
  onEdit(request: CollectionRequest): void {
    this.store.dispatch(loadRequestForEdit({ request }));
  }
  
  onDelete(requestId: string): void {
    this.store.dispatch(deleteCollectionRequest({ requestId }));
  }
} 