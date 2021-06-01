import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
export class HeaderComponent implements OnInit {
  categories: any;
  @Input() isAuth = false;
  @Input() user!: User;
  // @Output() clickedMenuItem = new EventEmitter<Category>();
  @ViewChild('searchText') searchTextRef!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private uiService: UiService,
    private slugifyPipe: SlugifyPipe
  ) { }

  ngOnInit(): void {
    this.dataService.getCategories().subscribe(res => {
      this.categories = (res as any).data;
    })
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
