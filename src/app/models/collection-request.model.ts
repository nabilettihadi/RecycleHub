export type WasteType = 'plastique' | 'verre' | 'papier' | 'metal';

export type RequestStatus = 'en_attente' | 'occupee' | 'en_cours' | 'validee' | 'rejetee';

export interface WasteItem {
    type: WasteType;
    weight: number;
    photos?: string[];
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country?: string;
}

export interface CollectionRequest {
  id: string;
  userId: string;
  wasteItems: WasteItem[];
  collectionAddress: Address;
  collectionDate: string;
  timeSlot: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  totalWeight: number;
  validatedWeight?: number;
  verifiedType?: WasteType;
  validationPhotos?: string[];
}

export interface CollectionRequestForm extends Omit<CollectionRequest, 
    'id' | 
    'userId' | 
    'status' | 
    'createdAt' | 
    'updatedAt' | 
    'validationPhotos' | 
    'actualWeight'
> {}
