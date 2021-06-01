import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Course} from "../app/models/course.model";
import {Category} from "../app/models/category.model";
import {Lecture} from "../app/models/lecture.model";
import {Chapter} from "../app/models/chapter.model";
import {AuthService} from "../app/auth/auth.service";

@Injectable({
  providedIn: "root"
})

export class DataService {
  base_url = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  // Course
  getCourses(){
    const url = `${this.base_url}/courses?limit=9`;
    return this.http.get<Course>(url);
  }

  getBestSellerCourseByCate(category: Category, page: number){
    const url = `${this.base_url}/categories/${category._id}/courses?bestseller=true&page=${page}&limit=5`;
    return this.http.get<any>(url);
  }

  getCourseById(courseId: any){
    const url = `${this.base_url}/courses/${courseId}`;
    return this.http.get<Course>(url);
  }

  getCoursesByCategoryId(categoryId: any){
    const url = `${this.base_url}/categories/${categoryId}/courses`;
    return this.http.get<Course>(url);
  }

  getCourseBySlug(slug: any){
    const url = `${this.base_url}/course/${slug}`;
    return this.http.get<Course>(url);
  }

  getCoursesBySearchText(searchText: string, limit: number){
    const url = `${this.base_url}/courses?q=${searchText}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  // Category
  getTopCategories(){
    const url = `${this.base_url}/categories?limit=8`;
    return this.http.get<Category>(url);
  }

  getCategories(){
    const url = `${this.base_url}/categories`;
    return this.http.get<Category>(url);
  }

  getCategoryBySlug(slug: any){
    const url = `${this.base_url}/categories/${slug}`;
    return this.http.get<Category>(url);
  }

  // Lecture
  getLecturesByCourseId(courseId: any){
    const url = `${this.base_url}/lectures/${courseId}`;
    return this.http.get<Lecture[]>(url);
  }

  // Chapter
  getChaptersByLectureId(lectureId: any){
    const url = `${this.base_url}/lectures/${lectureId}/chapters`;
    return this.http.get<Chapter[]>(url);
  }

  // Cart
  addToCart(user: any, course: any){
    const url = `${this.base_url}/auth/addToCart`;
    const data = {
      "userId": user._id,
      "courseId": course._id
    }
    return this.http.put(url, data);
  }

  removeCartItem(courseId: any){
    const url = `${this.base_url}/auth/removeCartItem`;
    const userId = this.authService.user._id;
    const data = {
      "userId": userId,
      "courseId": courseId
    }
    console.log('Remove: '+data);
    return this.http.put(url, data);
  }

  checkout(payment: any){
    const url = `${this.base_url}/payments`;
    return this.http.post(url, payment);
  }
}
