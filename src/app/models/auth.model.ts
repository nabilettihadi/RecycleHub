import { User } from './user.model';

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends Omit<User, 'id' | 'points'> {
  confirmPassword: string;
}
