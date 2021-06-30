import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
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
  base_url = `${Constants.base_upload}/courses/`;

  courses$!: Observable<Course[]>;
  freeCourses$!: Observable<Course[]>;

  counter!: number;
  cateCounter!: number;
  //
  categories: Category[] = [];
  //
  selectedIndex = 0;
  page: number = 1;

  // config: PaginationInstance = {
  //   itemsPerPage: this.counter,
  //   currentPage: 1
  // };

  constructor(private http: HttpClient,
              private authStore: AuthStore,
              private uiService: UiService,
              private dataStore: DataStore) {}

  ngOnInit(): void {
    this.getCounter();
    this.getCateCounter();

    this.dataStore.getTopCategories().subscribe(categories => {
      this.categories = categories;
      this.getCourses();
    })

    this.freeCourses$ = this.dataStore.getFreeCourses();

    // this.slider = setInterval(() => {
    //   if(this.selectedIndex < this.categories.length - 1){
    //     this.selectedIndex++;
    //   } else {
    //     this.selectedIndex = 0;
    //   }
    //   this.onClickTab(this.selectedIndex);
    // }, 4000);
  }
 // shuffle(items: any) {
 //   return items.sort(() => Math.random() - 0.5);
 //  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getCounter();
    this.getCateCounter();
  }

  private getCourses() {
    if (this.categories.length > 0) {
      this.courses$ = this.dataStore.getBestsellerCoursesByCategory(this.categories[this.selectedIndex]._id);
    }
  }

  onClickTab(index: any) {
    this.selectedIndex = index;
    this.getCourses();
  }

  getCounter() {
    const size = window.innerWidth;

    if(size > 1880){
      this.counter = 5;
    } else if(size > 1520){
      this.counter = 4;
    } else if(size > 1150){
      this.counter = 3;
    } else if(size > 788) {
      this.counter = 2;
    } else {
      this.counter = 1;
    }
  }

  private getCateCounter() {
    const size = window.innerWidth;
    if(size > 1900){
      this.cateCounter = 8;
    } else
    if(size > 1700){
      this.cateCounter = 7;
    } else
    if(size > 1500){
      this.cateCounter = 6;
    } else
    if(size > 1475){
      this.cateCounter = 5;
    } else if(size > 1150){
      this.cateCounter = 4;
    } else if(size > 788) {
      this.cateCounter = 3;
    } else {
      this.cateCounter = 2;
    }
  }
}
