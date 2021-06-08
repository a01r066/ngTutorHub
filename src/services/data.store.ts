import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Course} from "../app/models/course.model";
import {catchError, map, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "./loading.service";
import {MessagesService} from "./messages.service";
import {Constants} from "../app/helpers/constants";
import {Category} from "../app/models/category.model";

@Injectable({
  providedIn: "root"
})

export class DataStore {
  // Course section
  private coursesSub = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.coursesSub.asObservable();

// Category section
  private categoriesSub = new BehaviorSubject<Category[]>([]);
  categories$: Observable<Category[]> = this.categoriesSub.asObservable();

  constructor(private http: HttpClient,
              private loadingService: LoadingService,
              private messageService: MessagesService) {

    this.getAllCourses();
    this.getAllCategories();
  }

  // Course section
  private getAllCourses() {
    const url = `${Constants.base_url}/courses`;
    const loadingCourses$ = this.http.get<Course[]>(url)
      .pipe(
        map(res => (res as any).data),
        catchError(err => {
          const message = 'Could not load data. Please check your internet connection or try again later!';
          this.messageService.showErrors(message);
          return throwError(err);
        }),
        tap(courses => this.coursesSub.next(courses)))
    this.loadingService.showLoaderUntilCompleted(loadingCourses$).subscribe();
  }

  getCoursesByCategory(category: any): Observable<Course[]>{
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category === category)));
  }

  getBestsellerCoursesByCategory(category: any): Observable<Course[]>{
    return this.getCoursesByCategory(category)
      .pipe(
        map(courses => courses
          .filter(course => course.bestseller)));
  }

  searchCourses(searchText: any): Observable<Course[]>{
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.title.toLowerCase().includes(searchText.toLowerCase()))));
  }
  // End of course section

  // Category section
  private getAllCategories() {
    const url = `${Constants.base_url}/categories`;
    const loadingCategories = this.http.get(url)
      .pipe(
        map(res => (res as any).data),
        catchError(err => {
          const message = 'Could not load data. Please check your internet connection or try again later!';
          this.messageService.showErrors(message);
          return throwError(err);
        }),
        tap(categories => this.categoriesSub.next(categories)))
      this.loadingService.showLoaderUntilCompleted(loadingCategories).subscribe();
  }

  getTopCategories(): Observable<Category[]>{
    return this.categories$
      .pipe(
        map(categories => categories
          .filter(category => category.isTop)));
  }
}
