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

  courses: any;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private uiService: UiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
