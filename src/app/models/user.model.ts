export interface User {
    id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: {
        street: string;
        city: string;
        zipCode: string;
    };
    phoneNumber: string;
    dateOfBirth: Date;
    profilePicture?: string;
    userType: 'collector' | 'particular';
    points?: number;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface UserRegistration extends Omit<User, 'id' | 'userType' | 'points'> {
    confirmPassword: string;
}
