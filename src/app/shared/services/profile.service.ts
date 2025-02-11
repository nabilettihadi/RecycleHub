import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { User } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environments.apiUrl}/users`;
  private http = inject(HttpClient);

  updateProfile(userId: string, userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, userData);
  }

  deleteAccount(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

}
