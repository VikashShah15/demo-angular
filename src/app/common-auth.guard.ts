import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonAuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('cared-access-token') !== null) {
      return true;
    } else {
      if (state.url.includes('?returnURL')) {
        const splitUrl = state.url.split('?returnURL');
        this.router.navigate(['/authorize'], { queryParams: { returnurl: splitUrl[0] } });
      } else {
        this.router.navigate(['/authorize'], { queryParams: { returnurl: state.url } });
      }
      return false;
    }
  }
}
