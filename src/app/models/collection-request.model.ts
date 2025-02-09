import { Address } from './user.model';

export type WasteType = 'plastique' | 'verre' | 'papier' | 'metal';

export type RequestStatus = 'en_attente' | 'occupee' | 'en_cours' | 'validee' | 'rejetee';

export interface WasteItem {
    type: WasteType;
    weight: number;
    photos?: string[];
}

export interface CollectionRequest {
  id: string;
  userId: string;
  wasteItems: WasteItem[];
  collectionAddress: string;
  collectionDate: Date;
  timeSlot: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  totalWeight?: number; // Optional field to store total weight
}


export interface CollectionRequestForm extends Omit<CollectionRequest, 
    'id' | 
    'userId' | 
    'status' | 
    'collectorId' | 
    'createdAt' | 
    'updatedAt' | 
    'validationPhotos' | 
    'actualWeight'
> {}
