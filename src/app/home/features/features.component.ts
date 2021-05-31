import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {Subject} from "rxjs";
import {Course} from "../../models/course.model";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
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

  constructor(private http: HttpClient,
              private dataService: DataService,
              private router: Router,
              private authService: AuthService) {

    // Get courses request
    this.getBestSellerCourse();
  }

  ngOnInit(): void {
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.size = window.innerWidth;
    this.getCounter();
  }

  getBestSellerCourse(){
    this.dataService.getBestSellerCourses(this.page).subscribe(res => {
      this.courses = (res as any).data as Course[];
      this.isNext = (res as any).pagination.next;
      this.isPrevious = (res as any).pagination.prev;
      this.lastPageSub.next(res.count);
    }, error => console.log(error.message));
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
    console.log('counter: '+this.counter);
  }
}
