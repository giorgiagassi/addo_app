import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  getToken(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.stsTokenManager?.accessToken : null;
  }
}
