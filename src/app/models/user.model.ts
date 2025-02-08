export interface Address {
    street: string;
    city: string;
    zipCode: string;
}

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phoneNumber: string;
    address: Address;
    dateOfBirth: Date;
    role: 'collector' | 'particular';
    points: number;
    profilePicture?: string;
}
