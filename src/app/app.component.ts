import {Component, HostListener, OnInit} from '@angular/core';
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
  isSideBarHidden = false;
  constructor(
              private router: Router,
              private uiService: UiService
  ){}

  ngOnInit(): void {
    this.uiService.isPlayerSub.subscribe(isPlayer => {
      this.isPlayer = isPlayer;
    })

    this.uiService.isSideBarSub.subscribe(isHidden => {
      this.isSideBarHidden = isHidden;
    })

    this.uiService.categorySub.subscribe(category => {
      this.onClickMenu(category);
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getSize();
  }

  getSize(){
    const width = window.innerWidth;
    if(width < 800){
      this.uiService.isPlayerSub.next(true);
    } else {
      this.uiService.isPlayerSub.next(false);
    }
  }

  onClickMenu(event: Category){
    this.router.navigate(['courses', event.slug]);
  }
}
