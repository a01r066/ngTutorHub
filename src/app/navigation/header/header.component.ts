import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {Category} from "../../models/category.model";
import {UiService} from "../../services/ui.service";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {FeedbackComponent} from "../../home/Feedback/feedback.component";
import {DataStore} from "../../services/data.store";
import {AuthStore} from "../../services/auth.store";
import {Constants} from "../../helpers/constants";
import slugify from "slugify";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // base_url = 'http://localhost:3000/uploads/users';
  base_url = `${Constants.base_upload}/users/`;

  photoURL = Constants.user_placeholder;

  categories$!: Observable<Category[]>;
  user!: User;
  @ViewChild('searchText') searchTextRef!: ElementRef;
  isPlayer = false;
  @Input() isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private dataStore: DataStore,
    public authStore: AuthStore,
    private uiService: UiService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe(user => {
      this.user = user;
      if(user){
        this.getPhotoURL(user);
      }
    })

    this.uiService.isPlayerSub.subscribe(isPlayer => {
      this.isPlayer = isPlayer;
    })

    // this.categories$ = this.dataService.getCategories();
    this.categories$ = this.dataStore.categories$;
  }

  private getPhotoURL(user: User) {
      if(user.isSocial){
        this.photoURL = user.photoURL;
      } else {
        if(user.photoURL !== ''){
          this.photoURL = this.base_url + user.photoURL;
        }
      }
  }

  logout(){
    this.authStore.logout();
    this.router.navigate(['login']);
  }

  onClickCart(){
    if(this.user){
      this.router.navigate(['/cart']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onClickMenu(category: Category){
    this.uiService.categorySub.next(category);
  }

  clearText() {
    this.searchTextRef.nativeElement.value = '';
    this.searchTextRef.nativeElement.focus();
  }

  processSearch(searchText: string) {
    this.uiService.searchTextSub.next(searchText);
    this.searchTextRef.nativeElement.blur();
    let link = `search?${searchText}`.split('?')[0];
    const slugifyText = slugify(searchText);
    console.log('slugify: '+slugifyText);
    this.router.navigate([link], { queryParams: { q: slugifyText }});
  }

  sendFeedback() {
    const dialogRef = this.dialog.open(FeedbackComponent, {
      width: '35vw',
      data: {user: this.user},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.user = result;
    });
  }

  home() {
    this.router.navigate(['']);
  }
}
