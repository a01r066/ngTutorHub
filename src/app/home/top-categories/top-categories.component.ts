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

  //slider setting variable
  responsiveOptions: any;

  //define validable to store dynamic products data
  categories: any;

  constructor(private http: HttpClient,
              private dataService: DataService,
              private router: Router,
              private uiService: UiService) {
    //slider responsive settings
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    //get request
    // this.http.get('https://www.testjsonapi.com/products/').subscribe(data => {
    //   //data storing for use in html component
    //   this.products = data;
    // }, error => console.error(error));

    // Get courses request
    this.dataService.getCategories().subscribe(res => {
      this.categories = (res as any).data;
    })
  }

  ngOnInit(): void {
  }

  onClick(category: Category){
    this.router.navigate(['courses', category.slug]);
  }
}
