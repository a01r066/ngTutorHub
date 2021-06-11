import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthStore} from "../services/auth.store";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authStore: AuthStore,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authStore.getUser();
    if(user){
      return true;
    } else {
      return this.router.navigate(['/login']);
    }
  }
}
