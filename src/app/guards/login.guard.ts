import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Ya está logueado → lo mandamos al inicio
      this.router.navigate(['/inicio-admin-screen']);
      return false;
    }
    return true;
  }
}
