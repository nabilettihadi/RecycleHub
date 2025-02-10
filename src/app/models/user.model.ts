import { Address } from './collection-request.model';

export type UserType = 'collector' | 'particular';

export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    phoneNumber: string;
    dateOfBirth: Date;
    profilePicture?: string;
    userType: UserType;
    points: number;
    activeRequests?: string[];
}
