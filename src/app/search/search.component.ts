import { Component, OnInit } from '@angular/core';
import {Course} from "../models/course.model";
import {DataService} from "../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UiService} from "../services/ui.service";
import {catchError, map} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {LoadingService} from "../services/loading.service";
import {MessagesService} from "../services/messages.service";
import {DataStore} from "../services/data.store";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  base_url = 'http://18.117.94.38:3000/uploads/courses/';
  // loadingCourses!: Observable<Course[]>;
  courses$!: Observable<Course[]>;
  discount = 90;
  searchText!: string;
  limit = 5;

  constructor(private dataService: DataService,
              private router: Router,
              private uiService: UiService,
              private route: ActivatedRoute,
              private loadingService: LoadingService,
              private messageService: MessagesService,
              private dataStore: DataStore) { }

  ngOnInit(): void {
    this.route.queryParams
      .pipe()
      .subscribe(params => {
          // console.log(params.q); // popular
          this.searchText = params.q;
          // const courses$ = this.dataService.getCoursesBySearchText(this.searchText, this.limit)
          //   .pipe(
          //     map(courses => courses),
          //     catchError(err => {
          //   const message = 'Search error. Please check you internet connection and try again!';
          //   this.messageService.showErrors(message);
          //   return throwError(err);
          // }));
          // this.loadingCourses = this.loadingService.showLoaderUntilCompleted(courses$);
          this.courses$ = this.dataStore.searchCourses(this.searchText);
        }
      );
  }

  onClick(course: any){
    this.router.navigate(['/course', course.slug]);
  }

  getCoursePrice(course: any){
    return (course.tuition * (1 - this.discount/100));
  }
}
