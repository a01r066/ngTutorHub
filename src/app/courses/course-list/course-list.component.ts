import {AfterViewChecked, AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../../services/data.service";
import {UiService} from "../../../services/ui.service";
import {Category} from "../../models/category.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Course} from "../../models/course.model";
import {Subject} from "rxjs";

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  base_url = 'http://localhost:3000/uploads/courses/';
  selectedCategory!: Category;
  courses: Course[] = [];
  page = 1;
  discount = 90;

  isNext: any;
  isPrevious: any;
  lastPageSub = new Subject<number>();
  isLastPage = false;

  size: any;
  counter: any;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private uiService: UiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uiService.categorySub.subscribe(category => {
      this.selectedCategory = category;
      this.getCategoryBySlug();
    })
    // Get courses by category
    this.getCategoryBySlug();
  }

  next() {
    if(this.isNext && !this.isLastPage){
      this.page += 1;
      this.getBestSellerCourse();
    }
  }

  back() {
    if(this.isPrevious){
      this.page -= 1;
      this.getBestSellerCourse();
    }
  }

  getBestSellerCourse(){
    // this.dataService.getBestSellerCourses(this.page).subscribe(res => {
    //   this.courses = (res as any).data as Course[];
    //   this.isNext = (res as any).pagination.next;
    //   this.isPrevious = (res as any).pagination.prev;
    //   this.lastPageSub.next(res.count);
    // });
  }

  onClick(course: any){
    this.router.navigate(['/course', course.slug]);
  }

  getCoursePrice(course: any){
    return (course.tuition * (1 - this.discount/100));
  }

  private getCounter() {
    if(this.size > 1875){
      this.counter = 5;
    } else if(this.size > 1500){
      this.counter = 4;
    } else if(this.size > 1135){
      this.counter = 3;
    } else if(this.size > 768) {
      this.counter = 2;
    } else {
      this.counter = 1;
    }
  }

  private getCategoryBySlug() {
    let slug;
    if(this.selectedCategory){
      slug = this.selectedCategory.slug;
    } else {
      slug = this.route.snapshot.params['id'];
    }
    this.dataService.getCategoryBySlug(slug).subscribe(res => {
      this.selectedCategory = (res as any).data;

      this.dataService.getCoursesByCategoryId(this.selectedCategory._id).subscribe(res => {
        this.courses = (res as any).data;
      })
    })
  }
}
