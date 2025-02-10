import { User } from './user.model';

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends Omit<User, 'id' | 'points'> {
  confirmPassword: string;
}

export interface Collector {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: 'collector';
  dateOfBirth: Date;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  points: number;
}
