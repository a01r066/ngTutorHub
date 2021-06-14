import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Course} from "../../models/course.model";
import {UiService} from "../../services/ui.service";
import {DataStore} from "../../services/data.store";
import {Constants} from "../../helpers/constants";
import {AuthStore} from "../../services/auth.store";
import {Category} from "../../models/category.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  // base_url = 'http://localhost:3000/uploads/courses/';
  base_url = `${Constants.base_upload}/courses/`;

  courses$!: Observable<Course[]>;

  discount = 90;
  counter!: number;

  categories: Category[] = [];

  activeLink!: Category;
  selectedIndex = 0;
  page: number = 1;

  // config: PaginationInstance = {
  //   itemsPerPage: this.counter,
  //   currentPage: 1
  // };

  constructor(private http: HttpClient,
              private router: Router,
              private authStore: AuthStore,
              private uiService: UiService,
              private dataStore: DataStore) {}

  ngOnInit(): void {
    this.getCounter();

    this.dataStore.getTopCategories().subscribe(categories => {
      this.categories = categories;
      this.getCourses();
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getCounter();
  }

  private getCourses() {
    if (this.categories.length > 0) {
      this.courses$ = this.dataStore.getBestsellerCoursesByCategory(this.categories[this.selectedIndex]._id);
      // this.dataStore.getBestsellerCoursesByCategory(this.categories[this.selectedIndex]._id || '', this.counter, this.page).subscribe(res => {
      //   // console.log('res: ' + JSON.stringify(res));
      //   this.courses = (res as any).data;
      // });
    }
  }

  onClickTab(index: any) {
    this.selectedIndex = index;
    this.getCourses();
  }

  onClick(course: any){
    this.router.navigate(['course', course.slug]);
  }

  getCoursePrice(course: any){
    return (course.tuition * (1 - this.discount/100));
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
}
