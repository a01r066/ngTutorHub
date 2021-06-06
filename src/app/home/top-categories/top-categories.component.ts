import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";
import {UiService} from "../../../services/ui.service";
import {Category} from "../../models/category.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-top-categories',
  templateUrl: './top-categories.component.html',
  styleUrls: ['./top-categories.component.css']
})
export class TopCategoriesComponent implements OnInit {
  base_url = 'http://localhost:3000/uploads/categories/';
  categories$!: Observable<Category[]>;

  constructor(private http: HttpClient,
              private dataService: DataService,
              private router: Router,
              private uiService: UiService) {}

  ngOnInit(): void {
    this.categories$ = this.dataService.getTopCategories();
  }

  onClick(category: Category){
    this.router.navigate(['courses', category.slug]);
  }
}
