import {Component, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  items = ["Development", "Business", "Finance & Accounting", "IT & Software", "Learning English", "Marketing"];

  fillerNav = Array.from({length: 10}, (_, i) => `Category ${i + 1}`);

  private _mobileQueryListener: () => void;

  authSubscription!: Subscription;
  isAuth = false;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private authService: AuthService,
              private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.authService.initAuthListener();
    this.authSubscription = this.authService.authChanged.subscribe(isAuth => {
      this.isAuth = isAuth;
      this.authService.isAuthenticated = isAuth;
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.authSubscription.unsubscribe();
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['']);
  }
}
