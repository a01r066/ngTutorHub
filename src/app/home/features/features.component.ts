import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {Subject, Subscription} from "rxjs";
import {Course} from "../../models/course.model";
import {Category} from "../../models/category.model";
import {UiService} from "../../../services/ui.service";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit, OnDestroy {
  base_url = 'http://localhost:3000/uploads/courses/';
  courses: Course[] = [];
  page = 1;
  discount = 90;

  isNext: any;
  isPrevious: any;
  lastPageSub = new Subject<number>();
  isLastPage = false;

  size: any;
  counter: any;

  categoriesSubscription!: Subscription;
  indexSubscription!: Subscription;

  @Input() categories: Category[] = [];
  @Input() selectedIndex: number = 0;

  constructor(private http: HttpClient,
              private dataService: DataService,
              private router: Router,
              private authService: AuthService,
              private uiService: UiService) {

    // Get courses request
    if(this.categories.length > 0){
      this.getBestSellerCourse(this.categories[this.selectedIndex]);
    }
  }

  ngOnInit(): void {
    this.categoriesSubscription = this.uiService.categoriesSub.subscribe(categories => {
      this.categories = categories;
      this.getBestSellerCourse(this.categories[this.selectedIndex]);
    })
    this.indexSubscription = this.uiService.tabSelectedIndexSub.subscribe(index => {
      this.selectedIndex = index;
      // console.log('category: '+this.categories[index].title);
      this.getBestSellerCourse(this.categories[index]);
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

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
    this.indexSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.size = window.innerWidth;
    this.getCounter();
  }

  getBestSellerCourse(category: Category){
    this.dataService.getBestSellerCourseByCate(category, this.page).subscribe(res => {
      this.courses = (res as any).data as Course[];
      this.isNext = (res as any).pagination.next;
      this.isPrevious = (res as any).pagination.prev;
      this.lastPageSub.next(res.count);
    }, error => console.log(error.message));
  }

  next() {
    if(this.isNext && !this.isLastPage){
      this.page += 1;
      this.getBestSellerCourse(this.categories[this.selectedIndex]);
    }
  }

  back() {
    if(this.isPrevious){
      this.page -= 1;
      this.getBestSellerCourse(this.categories[this.selectedIndex]);
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
