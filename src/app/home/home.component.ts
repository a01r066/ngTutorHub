import {Component, OnInit} from '@angular/core';
import {Category} from "../models/category.model";
import {Observable} from "rxjs";
import {UiService} from "../services/ui.service";
import {DataStore} from "../services/data.store";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories$!: Observable<Category[]>;
  activeLink!: Category;

  constructor(
    private uiService: UiService,
    private dataStore: DataStore
  ) { }

  ngOnInit(): void {
    this.categories$ = this.dataStore.getTopCategories();
  }

  onClick(i: number){
    this.uiService.tabSelectedIndexSub.next(i);
  }
}
