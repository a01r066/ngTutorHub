import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Course} from "../app/models/course.model";
import {Category} from "../app/models/category.model";
import {Lecture} from "../app/models/lecture.model";
import {Chapter} from "../app/models/chapter.model";
import {AuthService} from "../app/auth/auth.service";
import {Constants} from "../app/helpers/constants";
import {Observable} from "rxjs";
import {map, shareReplay} from "rxjs/operators";
import {User} from "../app/models/user.model";

@Injectable({
  providedIn: "root"
})

export class DataService {
  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  // Course
  getBestSellerCourseByCate(category: Category, page: number): Observable<Course[]>{
    const url = `${Constants.base_url}/categories/${category._id}/courses?bestseller=true&page=${page}&limit=5`;
    return this.http.get<Course[]>(url)
      .pipe(
        map(res => (res as any).data), shareReplay());
  }

  getCoursesByCategoryId(categoryId: any): Observable<Course[]>{
    const url = `${Constants.base_url}/categories/${categoryId}/courses`;
    return this.http.get<Course[]>(url)
      .pipe(
        map(res => (res as any).data), shareReplay());
  }

  getCourseBySlug(slug: any): Observable<Course>{
    const url = `${Constants.base_url}/course/${slug}`;
    return this.http.get<Course>(url)
      .pipe(
        map(res => (res as any).data), shareReplay());
  }

  getCoursesBySearchText(searchText: string, limit: number){
    const url = `${Constants.base_url}/courses?q=${searchText}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  // Category
  getTopCategories(): Observable<Category[]>{
    const url = `${Constants.base_url}/categories?limit=8`;
    return this.http.get<Category[]>(url)
      .pipe(
        map(res => (res as any).data), shareReplay());
  }

  getCategories(): Observable<Category[]>{
    const url = `${Constants.base_url}/categories`;
    return this.http.get<Category>(url).
    pipe(
      map(res => (res as any).data), shareReplay());
  }

  getCategoryBySlug(slug: any): Observable<Category>{
    const url = `${Constants.base_url}/categories/${slug}`;
    return this.http.get<Category>(url)
      .pipe(
        map(res => (res as any).data), shareReplay());
  }

  // Lecture
  getLecturesByCourseId(courseId: any): Observable<Lecture[]>{
    const url = `${Constants.base_url}/lectures/${courseId}`;
    return this.http.get<Lecture[]>(url)
      .pipe(
        map(res => (res as any).data), shareReplay());
  }

  // Chapter
  getChaptersByLectureId(lectureId: any): Observable<Chapter[]>{
    const url = `${Constants.base_url}/lectures/${lectureId}/chapters`;
    return this.http.get<Chapter[]>(url)
      .pipe(
        map(res => (res as any).data), shareReplay());
  }

  // Cart
  addToCart(user: any, course: any): Observable<any>{
    const url = `${Constants.base_url}/auth/addToCart`;
    const data = {
      "userId": user._id,
      "courseId": course._id
    }
    return this.http.put(url, data).pipe(shareReplay());
  }

  removeCartItem(courseId: any){
    const url = `${Constants.base_url}/auth/removeCartItem`;
    const userId = this.authService.user._id;
    const data = {
      "userId": userId,
      "courseId": courseId
    }
    return this.http.put(url, data);
  }

  checkout(payment: any){
    const url = `${Constants.base_url}/payments`;
    return this.http.post(url, payment);
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

    return this.http.put(url, formData).pipe(shareReplay());
  }
}
