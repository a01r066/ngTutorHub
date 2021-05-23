import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Course} from "../app/models/course.model";
import {Category} from "../app/models/category.model";

@Injectable({
  providedIn: "root"
})

export class DataService {
  base_url = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  getCourses(){
    const url = `${this.base_url}/courses?limit=9`;
    return this.http.get<Course>(url);
  }

  getCategories(){
    const url = `${this.base_url}/categories?limit=8`;
    return this.http.get<Category>(url);
  }

  getCoursesByCategoryId(category: any){
    const url = `${this.base_url}/categories/${category._id}/courses`;
    return this.http.get<Course>(url);
  }

  getCategoryBySlug(slug: any){
    const url = `${this.base_url}/categories/${slug}`;
    return this.http.get<Category>(url);
  }
}
