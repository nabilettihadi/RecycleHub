import { Injectable } from '@angular/core';
import { CollectionRequest, WasteType, RequestStatus } from '../models/collection-request.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionRequestService {
  private readonly COLLECTION_REQUESTS_KEY = 'collection_requests';

  constructor() {}

  getCollectionRequests(): CollectionRequest[] {
    const requests = localStorage.getItem(this.COLLECTION_REQUESTS_KEY);
    if (!requests) return [];
    return JSON.parse(requests).map((request: any) => ({
      ...request,
      collectionDate: new Date(request.collectionDate),
      createdAt: new Date(request.createdAt),
      updatedAt: new Date(request.updatedAt)
    }));
  }

  getUserRequests(userId: string): CollectionRequest[] {
    return this.getCollectionRequests().filter(request => request.userId === userId);
  }

  createRequest(formData: any, userId: string): CollectionRequest {
    const request: CollectionRequest = {
      id: crypto.randomUUID(),
      userId,
      wasteItems: formData.wasteItems.map((item: any) => ({
        type: item.type as WasteType,
        weight: Number(item.weight),
        photos: item.photos || []
      })),
      collectionAddress: {
        street: formData.collectionAddress.street,
        city: formData.collectionAddress.city,
        postalCode: formData.collectionAddress.postalCode,
        country: 'Maroc'
      },
      collectionDate: new Date(formData.collectionDate),
      timeSlot: formData.timeSlot,
      status: 'en_attente',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalWeight: formData.wasteItems.reduce((total: number, item: any) => total + Number(item.weight), 0)
    };

    const requests = this.getCollectionRequests();
    requests.push(request);
    this.saveRequests(requests);
    return request;
  }

  validateRequest(formData: any): string | null {
    const totalWeight = formData.wasteItems.reduce(
      (total: number, item: any) => total + Number(item.weight), 
      0
    );
    
    if (totalWeight > 10000) {
      return 'Le poids total ne peut pas dépasser 10kg';
    }

    const invalidWeight = formData.wasteItems.some(
      (item: any) => Number(item.weight) < 1000
    );
    
    if (invalidWeight) {
      return 'Chaque déchet doit peser au minimum 1kg';
    }

    return null;
  }

  private saveRequests(requests: CollectionRequest[]): void {
    localStorage.setItem(this.COLLECTION_REQUESTS_KEY, JSON.stringify(requests));
  }

  getRequestsByCity(city: string): CollectionRequest[] {
    return this.getCollectionRequests().filter(request => 
      request.collectionAddress.city.toLowerCase() === city.toLowerCase()
    );
  }

  updateRequestStatus(requestId: string, status: RequestStatus): void {
    const requests = this.getCollectionRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        status,
        updatedAt: new Date()
      };
      this.saveRequests(requests);
    }
  }

  validateCollection(requestId: string): void {
    const requests = this.getCollectionRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        status: 'validee' as RequestStatus,
        updatedAt: new Date()
      };
      this.saveRequests(requests);
      
      this.calculateAndAssignPoints(requests[index]);
    }
  }

  private calculateAndAssignPoints(request: CollectionRequest): void {
    const pointsPerKg = {
      'plastique': 2,
      'verre': 1,
      'papier': 1,
      'metal': 5
    };

    const totalPoints = request.wasteItems.reduce((total, item) => {
      return total + (pointsPerKg[item.type as keyof typeof pointsPerKg] * item.weight / 1000);
    }, 0);

    // Ici, vous devriez appeler un service pour mettre à jour les points de l'utilisateur
    console.log(`Points attribués à l'utilisateur ${request.userId}: ${totalPoints}`);
  }
}
