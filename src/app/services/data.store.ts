import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, of, Subject, throwError} from "rxjs";
import {Course} from "../models/course.model";
import {catchError, last, map, shareReplay, takeLast, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "./loading.service";
import {MessagesService} from "./messages.service";
import {Constants} from "../helpers/constants";
import {Category} from "../models/category.model";
import {Lecture} from "../models/lecture.model";
import {Chapter} from "../models/chapter.model";
import {User} from "../models/user.model";
import {Coupon} from "../models/coupon.model";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  isTracker = new Subject();

  constructor(private http: HttpClient,
              private loadingService: LoadingService,
              private messageService: MessagesService,
              private snackBar: MatSnackBar) {

    this.getAllCourses();
    this.getAllCategories();
  }

  showSnackBar(message: any){
    this.snackBar.open(message, null!, {
      duration: 3000
    })
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
        tap(courses => {
          this.coursesSub.next(courses);
        }),
        shareReplay()
      )
    this.loadingService.showLoaderUntilCompleted(loadingCourses$).subscribe();
  }

  getCoursesByCategory(category: any): Observable<Course[]>{
    // return this.courses$
    //   .pipe(
    //     map(courses => courses
    //       .filter(course => course.category === category)));

    const url = `${Constants.base_url}/categories/${category}/courses`;
    const loadingCourses$ = this.http.get<Course[]>(url)
      .pipe(
        map(res => (res as any).data),
        catchError(err => {
          const message = 'Could not load data. Please check your internet connection or try again later!';
          this.messageService.showErrors(message);
          return throwError(err);
        }),
        // tap(courses => this.coursesSub.next(courses))
        shareReplay()
      )
    return this.loadingService.showLoaderUntilCompleted(loadingCourses$);
  }

  getBestsellerCoursesByCategory(category: any): Observable<Course[]>{
    return this.getCoursesByCategory(category)
      .pipe(
        map(courses => courses
          .filter(course => course.bestseller && course.isPublished)),
        shareReplay()
      );
  }

  getFreeCourses(): Observable<Course[]>{
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.isFree)),
        shareReplay()
      );
  }

  // getBestsellerCoursesByCategory(categoryId: string, counter: number, page: number): Observable<any>{
  //   const url = `${Constants.base_url}/courses?bestseller=true&category=${categoryId}&limit=${counter}&page=${page}`;
  //   return this.http.get(url)
  //     .pipe(
  //       map(res => (res as any)),
  //       shareReplay());
  // }

  searchCourses(searchText: any): Observable<Course[]>{
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.title.toLowerCase().includes(searchText.toLowerCase()) && course.isPublished)),
        shareReplay());
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

  createCourse(formData: any): Observable<any>{
    const url = `${Constants.base_url}/courses`;
    return this.http.post(url, formData)
      .pipe(
        map(res => (res as any).data),
        catchError(err => {
          const message = 'Create failed. Please check your internet connection!';
          this.messageService.showErrors(message);
          return throwError(err);
        }),
        shareReplay());
  }

  getCourseBySlug(slug: any): Observable<Course>{
    const url = `${Constants.base_url}/course/${slug}`;
    return this.http.get<Course>(url)
      .pipe(
        map(res => (res as any).data),
        shareReplay());
  }

  deleteCourse(courseId: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/courses/${courseId}`;
    return this.http.delete(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay());
  }

  getLecturesByCourseId(courseId: any): Observable<Lecture[]>{
    const url = `${Constants.base_url}/lectures/${courseId}`;
    return this.http.get<Lecture[]>(url)
      .pipe(
        map(res => (res as any).data),
        shareReplay());
  }

  createLecture(formData: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/lectures`;
    return this.http.post(url, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay());
  }

  updateLecture(lectureId: any, changes: Partial<Lecture>): Observable<any>{
    const url = `${Constants.base_url}/lectures/${lectureId}`;
    return this.http.put(url, changes).pipe(shareReplay());
  }

  getChaptersByLectureId(lectureId: any): Observable<Chapter[]>{
    const url = `${Constants.base_url}/lectures/${lectureId}/chapters`;
    return this.http.get<Chapter[]>(url)
      .pipe(
        map(res => (res as any).data),
        catchError(err => {
          // return throwError(err);
          this.isTracker.next(true);
          return of([]);
        }),
        shareReplay());
  }

  getLectureById(lectureId: any): Observable<Lecture>{
    const url = `${Constants.base_url}/lecture/${lectureId}`;
    return this.http.get(url)
      .pipe(map(res => (res as any).data)
      ,shareReplay());
  }

  deleteLecture(lectureId: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/lectures/${lectureId}`;
    return this.http.delete(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay());
  }

  createChapter(formData: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/chapters`;
    return this.http.post(url, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay());
  }

  updateChapter(chapterId: any, changes: Partial<Chapter>){
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/chapters/${chapterId}`;
    return this.http.put(url, changes, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay());
  }

  deleteChapter(chapterId: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/chapters/${chapterId}`;
    return this.http.delete(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay());
  }

  chapterFileUpload(chapterId: any, formValue: any, file: any, type: string): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/chapters/${chapterId}/${type}`;

    let frm = new FormData();
    frm.append('courseId', formValue.courseId);
    frm.append('lectureId', formValue.lectureId);
    frm.append('title', formValue.title);
    frm.append('file', file);
    return this.http.put(url, frm, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay())
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

  uploadPhoto(objName: string, objId: string, file: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/${objName}/${objId}/photo`;

    const formData = new FormData();
    formData.append('file', file);

    return this.http.put(url, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(
      catchError(err => {
        return throwError(err);
      }), shareReplay())
  }

  getCategoryBySlug(slug: any): Observable<Category>{
    const url = `${Constants.base_url}/categories/${slug}`;
    return this.http.get<Category>(url)
      .pipe(
        map(res => (res as any).data), shareReplay());
  }

  // Cart
  addToCart(userId: any, courseId: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/auth/addToCart`;
    const data = {
      "userId": userId,
      "courseId": courseId
    }
    return this.http.put(url, data, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay());
  }

  removeCartItem(courseId: any, userId: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/auth/removeCartItem`;
    const data = {
      "userId": userId,
      "courseId": courseId
    }
    return this.http.put(url, data, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay());
  }

  checkout(payment: any): Observable<any>{
    const url = `${Constants.base_url}/payments`;
    return this.http.post(url, payment).pipe(shareReplay());
  }

  // User
  updateProfile(userId: string, changes: Partial<User>): Observable<any>{
    const url = `${Constants.base_url}/auth/${userId}`;
    return this.http.put(url, changes).pipe(
      shareReplay()
    );
  }

  updatePhotoProfile(userId: string, file: any): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    const url = `${Constants.base_url}/auth/${userId}/photo`;

    return this.http.put(url, formData)
      .pipe(shareReplay());
  }

  createFeedback(formData: any, uid: any): Observable<any>{
    const data = {
      "user": uid,
      "subject": formData.subject,
      "message": formData.message
    }
    const url = `${Constants.base_url}/feedbacks`;
    return this.http.post(url, data);
  }

  // Coupons
  getCoupons(): Observable<Coupon[]>{
    const url = `${Constants.base_url}/coupons`;
    return this.http.get(url)
      .pipe(map(res => (res as any).data),
        shareReplay());
  }

  createCoupon(formData: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/coupons`;
    return this.http.post(url, formData, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .pipe(shareReplay());
  }

  updateCoupon(couponId: string, changes: Partial<Coupon>): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/coupons/${couponId}`;
    return this.http.put(url, changes, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .pipe(shareReplay());
  }

  updateWishlist(userId: any, courseId: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/auth/updateWishlist`;
    const data = {
      "userId": userId,
      "courseId": courseId
    }
    return this.http.put(url, data, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay());
  }

  // Trackers
  addTracker(formData: any): Observable<any>{
    const token = localStorage.getItem('token');
    const url = `${Constants.base_url}/trackers`;
    return this.http.post(url, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).pipe(shareReplay());
  }

  getTracker(userId: any, courseId: any): Observable<any>{
    const url = `${Constants.base_url}/trackers/${userId}/${courseId}`;
    return this.http.get(url)
      .pipe(
        map((res =>  (res as any).data)),
        catchError(err => {
          // return throwError(err);
          this.isTracker.next(true);
          return of([]);
        })
        ,shareReplay());
  }

  updateDuration(chapterId: any, duration: number): Observable<any>{
    const data = {
      "duration": duration
    }
    const url = `${Constants.base_url}/chapter/${chapterId}`;
    return this.http.put(url, data)
      .pipe(shareReplay());
  }
}
