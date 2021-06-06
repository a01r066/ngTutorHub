import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {Observable, Subject, Subscription} from "rxjs";
import {Course} from "../../models/course.model";
import {Category} from "../../models/category.model";
import {UiService} from "../../../services/ui.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  base_url = 'http://localhost:3000/uploads/courses/';

  courses$!: Observable<Course[]>;

  page = 1;
  discount = 90;

  isNext: any;
  isPrevious: any;
  lastPageSub = new Subject<number>();
  isLastPage = false;

  size: any;
  counter: any;

  @Input() categories$!: Observable<Category[]>;
  @Input() selectedIndex: number = 0;
  selectedCategory!: Category;

  constructor(private http: HttpClient,
              private dataService: DataService,
              private router: Router,
              private authService: AuthService,
              private uiService: UiService) {}

  ngOnInit(): void {
    this.getCoursesByCategory();

    this.uiService.tabSelectedIndexSub.subscribe(index => {
      this.selectedIndex = index;
      this.getCoursesByCategory();
    })

    this.size = window.innerWidth;
    this.getCounter();

    this.lastPageSub.subscribe(counter => {
      if(counter < 5){
        this.isLastPage = true;
      } else {
        this.isLastPage = false;
      }
    })
  }

  private getCoursesByCategory(){
    this.categories$.subscribe(categories => {
      this.selectedCategory = categories[this.selectedIndex];
      this.courses$ = this.dataService.getBestSellerCourseByCate(this.selectedCategory, this.page);
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.size = window.innerWidth;
    this.getCounter();
  }

  next() {
    if(this.isNext && !this.isLastPage){
      this.page += 1;
      // this.getCourses();
    }
  }

  back() {
    if(this.isPrevious){
      this.page -= 1;
      // this.getCourses();
    }
  }

  onClick(course: any){
    this.router.navigate(['course', course.slug]);
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
}
