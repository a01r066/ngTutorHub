import {Component, OnInit} from '@angular/core';
import {Category} from "../models/category.model";
import {DataService} from "../../services/data.service";
import {Observable} from "rxjs";
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories$!: Observable<Category[]>;
  selectedCategory!: Category;
  selectedIndex = 0;
  activeLink!: Category;

  constructor(
    private dataService: DataService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.categories$ = this.dataService.getTopCategories();
    this.categories$.subscribe(categories => {
      this.selectedCategory = categories[this.selectedIndex];
      this.activeLink = this.selectedCategory;
    })
  }

  onClick(i: number){
    this.uiService.tabSelectedIndexSub.next(i);
    this.selectedIndex = i;
  }
}
