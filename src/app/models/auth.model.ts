import { User } from './user.model';


export interface RegisterForm extends Omit<User, 'id' | 'userType' | 'points'> {
    confirmPassword: string;
}

export interface LoginForm {
    email: string;
    password: string;
}
