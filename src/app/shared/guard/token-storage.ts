import { Injectable } from '@angular/core';


const TOKEN_KEY = 'AuthToken';
const REFRESH_TOKEN_KEY = 'RefreshAuthToken';
const CURRENT_USER = 'currentUser';
const MODULE = 'module';

@Injectable()
export class TokenStorage {

  constructor() { }

  signOut() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER);
    localStorage.removeItem(MODULE)
    localStorage.setItem('isLoggedin', 'false');
    localStorage.clear();
    window.sessionStorage.clear();
  }

  public saveToken(token: string, refreshToken: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);

    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public getRefreshToken(): string {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }
}
