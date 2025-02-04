import { Address } from './user.model';

export type WasteType = 'plastique' | 'verre' | 'papier' | 'metal';

export type RequestStatus = 'en_attente' | 'occupee' | 'en_cours' | 'validee' | 'rejetee';

export interface WasteItem {
    type: WasteType;
    weight: number;
    photos?: string[];
}

export interface CollectionRequest {
    id?: string;
    userId: string;
    wasteItems: WasteItem[];
    totalWeight: number;
    collectionAddress: Address;
    collectionDate: Date;
    timeSlot: string;
    notes?: string;
    status: RequestStatus;
    collectorId?: string;
    createdAt: Date;
    updatedAt: Date;
    validationPhotos?: string[];
    actualWeight?: number;
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
