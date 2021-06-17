import {Component, OnInit} from '@angular/core';
import {User} from "./models/user.model";
import {Category} from "./models/category.model";
import {Router} from "@angular/router";
import {UiService} from "./services/ui.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user!: User;
  isPlayer = false;
  constructor(
              private router: Router,
              private uiService: UiService
  ){}

  ngOnInit(): void {
    this.uiService.isPlayerSub.subscribe(isPlayer => {
      this.isPlayer = isPlayer;
    })
    this.uiService.categorySub.subscribe(category => {
      this.onClickMenu(category);
    })
  }

  onClickMenu(event: Category){
    this.router.navigate(['courses', event.slug]);
  }
}
