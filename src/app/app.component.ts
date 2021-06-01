import {Component, OnInit} from '@angular/core';
import {OnDestroy} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {Subscription} from "rxjs";
import {User} from "./models/user.model";
import {Category} from "./models/category.model";
import {Router} from "@angular/router";
import {UiService} from "../services/ui.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  authSubscription!: Subscription;
  isAuth = false;
  user!: User;

  constructor(private authService: AuthService,
              private router: Router,
              private uiService: UiService){}

  ngOnInit(): void {
    this.authService.initAuthListener();
    this.authSubscription = this.authService.authChanged.subscribe(isAuth => {
      this.isAuth = isAuth;
      this.authService.isAuthenticated = isAuth;
      this.user = this.authService.user;
    })

    this.uiService.categorySub.subscribe(category => {
      this.onClickMenu(category);
    })
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onClickMenu(event: Category){
    this.router.navigate(['courses', event.slug]);
  }
}
