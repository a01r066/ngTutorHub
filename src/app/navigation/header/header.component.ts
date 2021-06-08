import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {DataService} from "../../../services/data.service";
import {Category} from "../../models/category.model";
import {UiService} from "../../../services/ui.service";
import {SlugifyPipe} from "../../helpers/slugify.pipe";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {FeedbackComponent} from "../../home/Feedback/feedback.component";
import {DataStore} from "../../../services/data.store";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  base_url = 'http://localhost:3000/uploads/users';
  photoURL!: any;

  categories$!: Observable<Category[]>;
  user!: User;
  @ViewChild('searchText') searchTextRef!: ElementRef;
  isPlayer = false;
  @Input() isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    // private dataService: DataService,
    private dataStore: DataStore,
    private uiService: UiService,
    private slugifyPipe: SlugifyPipe,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.authService.authChanged.subscribe(isAuth => {
      this.user = this.authService.user;
      this.getPhoto();
    })
    this.uiService.isPlayerSub.subscribe(isPlayer => {
      this.isPlayer = isPlayer;
    })

    // this.categories$ = this.dataService.getCategories();
    this.categories$ = this.dataStore.categories$;
  }

  getPhoto(){
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
    const slugifyText = this.slugifyPipe.transform(searchText);
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
}
