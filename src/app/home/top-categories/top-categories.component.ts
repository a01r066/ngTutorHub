import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";
import {UiService} from "../../../services/ui.service";
import {Category} from "../../models/category.model";
import {Observable} from "rxjs";
import {DataStore} from "../../../services/data.store";

@Component({
  selector: 'app-top-categories',
  templateUrl: './top-categories.component.html',
  styleUrls: ['./top-categories.component.css']
})
export class TopCategoriesComponent implements OnInit {
  base_url = 'http://localhost:3000/uploads/categories/';
  categories$!: Observable<Category[]>;

  constructor(private http: HttpClient,
              // private dataService: DataService,
              private dataStore: DataStore,
              private router: Router) {}

  ngOnInit(): void {
    // this.categories$ = this.dataService.getTopCategories();
    this.categories$ = this.dataStore.getTopCategories();
  }

  onClick(category: Category){
    this.router.navigate(['courses', category.slug]);
  }
}
