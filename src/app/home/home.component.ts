import {Component, OnInit} from '@angular/core';
import {Category} from "../models/category.model";
import {DataService} from "../../services/data.service";
import {Observable, throwError} from "rxjs";
import {UiService} from "../../services/ui.service";
import {LoadingService} from "../../services/loading.service";
import {catchError, map} from "rxjs/operators";
import {MessagesService} from "../../services/messages.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loadingCategories$!: Observable<Category[]>;
  selectedIndex = 0;
  activeLink!: Category;

  constructor(
    private dataService: DataService,
    private uiService: UiService,
    private loadingService: LoadingService,
    private messageService: MessagesService
  ) { }

  ngOnInit(): void {
    const categories$ = this.dataService.getTopCategories()
      .pipe(
        map(categories => categories), catchError(err => {
          const message = 'Could not load data. Please check your connection or try again later!';
          this.messageService.showErrors(message);
          return throwError(err); // terminate the process and create new observable that emit the error it's end of life cycle
        }));
    this.loadingCategories$ = this.loadingService.showLoaderUntilCompleted(categories$);
  }

  onClick(i: number){
    this.uiService.tabSelectedIndexSub.next(i);
    this.selectedIndex = i;
  }
}
