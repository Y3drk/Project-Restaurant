import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class ManagementGuard implements CanActivate {
  constructor(public authServ: AuthenticationService, public router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authServ.userLoggedIn || (this.authServ.getHighestRole() != 'manager' && this.authServ.getHighestRole() != 'admin')){
      this.router.navigate(['/home'])
    }
    return true;
  }

}
