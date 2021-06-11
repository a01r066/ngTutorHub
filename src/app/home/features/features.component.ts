import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Course} from "../../models/course.model";
import {UiService} from "../../services/ui.service";
import {DataStore} from "../../services/data.store";
import {Constants} from "../../helpers/constants";
import {AuthStore} from "../../services/auth.store";
import {Category} from "../../models/category.model";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  // base_url = 'http://localhost:3000/uploads/courses/';
  base_url = `${Constants.base_upload}/courses/`;

  courses$!: Observable<Course[]>;

  page = 1;
  discount = 90;

  isNext: any;
  isPrevious: any;
  lastPageSub = new Subject<number>();
  isLastPage = false;

  size: any;
  counter: any;

  categories: Category[] = [];

  activeLink!: Category;
  selectedIndex = 0;

  constructor(private http: HttpClient,
              private router: Router,
              private authStore: AuthStore,
              private uiService: UiService,
              private dataStore: DataStore) {}

  ngOnInit(): void {
    this.dataStore.getTopCategories().subscribe(categories => {
      this.categories = categories;
      if(categories.length > 0){
        this.courses$ = this.dataStore.getBestsellerCoursesByCategory(categories[this.selectedIndex]._id);
      }
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

  onClickTab(index: any) {
    this.selectedIndex = index;
    this.courses$ = this.dataStore.getBestsellerCoursesByCategory(this.categories[this.selectedIndex]._id);
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
