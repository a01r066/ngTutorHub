import {Component, OnInit} from '@angular/core';
import {Category} from "../models/category.model";
import {DataService} from "../../services/data.service";
import {Observable} from "rxjs";
import {UiService} from "../../services/ui.service";
import {LoadingService} from "../../services/loading.service";
import {finalize, map} from "rxjs/operators";

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
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    const categories$ = this.dataService.getTopCategories().pipe(map(categories => categories));
    this.loadingCategories$ = this.loadingService.showLoaderUntilCompleted(categories$);
  }

  onClick(i: number){
    this.uiService.tabSelectedIndexSub.next(i);
    this.selectedIndex = i;
  }
}
