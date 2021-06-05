import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {DataService} from "../../../services/data.service";
import {Category} from "../../models/category.model";
import {UiService} from "../../../services/ui.service";
import {SlugifyPipe} from "../../helpers/slugify.pipe";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  base_url = 'http://localhost:3000/uploads/users';
  photoURL!: any;

  categories: any;
  @Input() isAuth = false;
  @Input() user!: User;
  // @Output() clickedMenuItem = new EventEmitter<Category>();
  @ViewChild('searchText') searchTextRef!: ElementRef;
  isPlayer = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private uiService: UiService,
    private slugifyPipe: SlugifyPipe
  ) { }

  ngOnInit(): void {
    this.authService.authChanged.subscribe(isAuth => {
     this.refreshUser();
    })

    this.uiService.isPlayerSub.subscribe(isPlayer => {
      this.isPlayer = isPlayer;
    })

    this.dataService.getCategories().subscribe(res => {
      this.categories = (res as any).data;
    })
  }

  ngAfterViewInit(): void {
  }

  refreshUser(){
    this.user = this.authService.user;
    if(!this.user.isSocial){
      this.photoURL = `${this.base_url}/${this.user.photoURL}`;
    } else {
      this.photoURL = this.user.photoURL;
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['']);
  }

  onClickCart(){
    if(this.isAuth){
      this.router.navigate(['/cart']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onClickMenu(category: Category){
    this.uiService.categorySub.next(category);
    // this.clickedMenuItem.emit(category);
  }

  clearText() {
    this.searchTextRef.nativeElement.value = '';
    this.searchTextRef.nativeElement.focus();
  }

  processSearch(searchText: string) {
    this.uiService.searchTextSub.next(searchText);
    this.searchTextRef.nativeElement.blur();
    let link = `search?${searchText}`.split('?')[0];
    const slugifyText = this.slugifyPipe.transform(searchText);
    this.router.navigate([link], { queryParams: { q: slugifyText }});
  }
}
