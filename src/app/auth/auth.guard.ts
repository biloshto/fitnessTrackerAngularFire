import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  // we need the authService to find out whether the user is authenticated or not

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.authService.isAuth()) {
      // the isAuth() method returns true if the user is authenticated, and false if it's not; so if this returns true we want to return true
      return true;
    } else {
      // otherwise, if this returns false, we want to redirect the user to the Login page so they won't get stucked
      this.router.navigate(['/login']);
    }
  }

  canLoad(route: Route) {
    if(this.authService.isAuth()) {
      // the isAuth() method returns true if the user is authenticated, and false if it's not; so if this returns true we want to return true
      return true;
    } else {
      // otherwise, if this returns false, we want to redirect the user to the Login page so they won't get stucked
      this.router.navigate(['/login']);
    }
  }
}

// the AuthGuard needs to return true, or a promise that resolves to true, or an observable that resolves to true, to grant access to a route the user wants to load (to grant access it needs to know that the user is authenticated)
// we need to do something if it's not true or otherwise the routing would not be allowed and the user will get stucked