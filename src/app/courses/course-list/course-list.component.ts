import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../../services/data.service";
import {UiService} from "../../../services/ui.service";
import {Category} from "../../models/category.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  base_url = 'http://localhost:3000/uploads/courses/';
  selectedCategory!: Category;

  //slider setting variable
  responsiveOptions: any;

  //define validable to store dynamic products data
  courses: any;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private uiService: UiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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
  }

  ngOnInit(): void {
    // Get courses by category
    const slug = this.route.snapshot.params['id'];
   this.dataService.getCategoryBySlug(slug).subscribe(res => {
     this.selectedCategory = (res as any).data;

     this.dataService.getCoursesByCategoryId(this.selectedCategory._id).subscribe(res => {
       this.courses = (res as any).data;
     })
   })
  }

  onClick(course: any){
    this.router.navigate(['course', course.slug]);
  }
}
