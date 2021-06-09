import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject, throwError} from "rxjs";
import {Course} from "../models/course.model";
import {catchError, map, shareReplay, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "./loading.service";
import {MessagesService} from "./messages.service";
import {Constants} from "../helpers/constants";
import {Category} from "../models/category.model";

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

  updateCourse(courseId: any, changes: Partial<Course>): Observable<any>{
    // Find and update course in memory
    const courses = this.coursesSub.getValue();
    const index = courses.findIndex(course => course._id === courseId);

    courses[index] = {
      ...courses[index],
      ...changes
    }

    this.coursesSub.next(courses);

    // Update changes to the backend
    const url = `${Constants.base_url}/courses/${courseId}`;
    return this.http.put(url, changes)
      .pipe(
        catchError(err => {
          const message = 'Update failed. Please check your internet connection';
          this.messageService.showErrors(message);
          return throwError(err);
        }),
        tap(courses => courses),
        shareReplay());
  }
  // End of course section

  // Category section
  private getAllCategories() {
    const url = `${Constants.base_url}/categories?isHidden=false`;
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

  updateCategory(categoryId: any, changes: Partial<Category>){
    const categories = this.categoriesSub.getValue(); // get values from memory
    const index = categories.findIndex(category => category._id === categoryId);

    categories[index] = {
      ...categories[index],
      ...changes
    };

    this.categoriesSub.next(categories);

    // update change to backend
    const url = `${Constants.base_url}/categories/${categoryId}`;
    return this.http.put(url, changes)
      .pipe(
        catchError(err => {
          const message = 'Update failed. Please check your internet connection!';
          this.messageService.showErrors(message);
          return throwError(err);
        }), shareReplay());
  }

  createCategory(formData: any): Observable<any>{
    const url = `${Constants.base_url}/categories`;
    return this.http.post(url, formData)
      .pipe(
        catchError(err => {
          const message = 'Update failed. Please check your internet connection!';
          this.messageService.showErrors(message);
          return throwError(err);
        }), shareReplay());
  }
}
