import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";
import {UiService} from "../../../services/ui.service";
import {Category} from "../../models/category.model";

@Component({
  selector: 'app-top-categories',
  templateUrl: './top-categories.component.html',
  styleUrls: ['./top-categories.component.css']
})
export class TopCategoriesComponent implements OnInit {
  base_url = 'http://localhost:3000/uploads/categories/';
  categories: any;

  constructor(private http: HttpClient,
              private dataService: DataService,
              private router: Router,
              private uiService: UiService) {

    // Get courses request
    this.dataService.getTopCategories().subscribe(res => {
      this.categories = (res as any).data;
    })
  }

  ngOnInit(): void {
  }

  onClick(category: Category){
    this.router.navigate(['courses', category.slug]);
  }
}
