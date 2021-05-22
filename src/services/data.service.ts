import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {Course} from "../app/models/course.model";
import {Category} from "../app/models/category.model";

@Injectable({
  providedIn: "root"
})

export class DataService {
  base_url = 'http://localhost:3000/api/v1';
  constructor(private http: HttpClient) {

  }

  getCourses(){
    return this.http.get<Course>(this.base_url+'/courses?limit=9');
  }

  getCategories(){
    return this.http.get<Category>(this.base_url+'/categories?limit=8');
  }
}
