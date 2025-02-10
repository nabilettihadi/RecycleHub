export interface Address {
    street: string;
    city: string;
    zipCode: string;
}

export interface User {
    id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: Address;
    phoneNumber: string;
    dateOfBirth: Date;
    profilePicture?: string;
    userType: 'collector' | 'particular';
    points?: number;
}
