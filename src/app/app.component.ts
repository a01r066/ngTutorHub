import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {User} from "./models/user.model";
import {Category} from "./models/category.model";
import {Router} from "@angular/router";
import {UiService} from "../services/ui.service";
import {LoadingService} from "../services/loading.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoadingService]
})
export class AppComponent implements OnInit {
  user!: User;
  isAuthenticated = false;
  constructor(private authService: AuthService,
              private router: Router,
              private uiService: UiService,
              public loadingService: LoadingService){}

  ngOnInit(): void {
    this.authService.initAuthListener();

    this.uiService.categorySub.subscribe(category => {
      this.onClickMenu(category);
    })
  }

  onClickMenu(event: Category){
    this.router.navigate(['courses', event.slug]);
  }
}
