import {Component, HostListener, OnInit} from '@angular/core';
import {UiService} from "../../services/ui.service";
import {Category} from "../../models/category.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Course} from "../../models/course.model";
import {Observable} from "rxjs";
import {DataStore} from "../../services/data.store";
import {Constants} from "../../helpers/constants";
import {Instructor} from "../../models/instructor.model";

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  base_url = `${Constants.base_upload}/courses/`;
  path = `${Constants.base_upload}/instructors/`;

  category!: Category;
  topCourses: Course[] = [];
  courses: Course[] = [];
  page: number = 1;
  fPage: number = 1;
  discount = 90;
  size: any;
  counter: any;
  instructors$!: Observable<Instructor[]>;

  constructor(
    private dataStore: DataStore,
    private uiService: UiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getCounter();
    this.getCategoryBySlug();

    this.uiService.categorySub.subscribe(category => {
      this.category = category;
      // Get courses
      this.dataStore.getBestsellerCoursesByCategory(category._id).subscribe(courses => {
        this.topCourses = courses.reverse();
      });
      this.dataStore.getCoursesByCategory(category._id).subscribe(courses => {
        this.courses = courses.filter(course => course.isPublished).reverse();
      });

      this.instructors$ = this.dataStore.getInstructors(category._id);
    })
  }

  // shuffle(items: any) {
  //   return items.sort(() => Math.random() - 0.5);
  // }

  getSalePrice(course: any) {
    const tuition = course.tuition;
    const discount = course.coupon.discount;
    return (tuition * (1 - discount/100));
  }

  private getCategoryBySlug() {
    const slug = this.route.snapshot.params['id'];
    this.dataStore.getCategoryBySlug(slug).subscribe(category => {
      this.category = category;
      // Get courses
      this.dataStore.getBestsellerCoursesByCategory(category._id).subscribe(courses => {
        this.topCourses = courses.reverse();
      });
      this.dataStore.getCoursesByCategory(category._id).subscribe(courses => {
        this.courses = courses.filter(course => course.isPublished).reverse();
      });

      this.instructors$ = this.dataStore.getInstructors(category._id);
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getCounter();
  }

  getCounter() {
    const size = window.innerWidth;

    if(size > 1875){
      this.counter = 5;
    } else if(size > 1500){
      this.counter = 4;
    } else if(size > 1135){
      this.counter = 3;
    } else if(size > 768) {
      this.counter = 2;
    } else {
      this.counter = 1;
    }
  }

  onClick(course: any){
    this.router.navigate(['/course', course.slug]);
  }

  onClickInstructor(instructorId: any) {
    this.router.navigate(['/user', instructorId]);
  }
}
