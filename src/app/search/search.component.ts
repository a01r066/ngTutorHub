import { Component, OnInit } from '@angular/core';
import {Course} from "../models/course.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UiService} from "../services/ui.service";
import {Observable} from "rxjs";
import {LoadingService} from "../services/loading.service";
import {MessagesService} from "../services/messages.service";
import {DataStore} from "../services/data.store";
import {Constants} from "../helpers/constants";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // base_url = 'http://18.117.94.38:3000/uploads/courses/';
  base_url = `${Constants.base_upload}/courses/`;
  courses$!: Observable<Course[]>;
  searchText!: string;
  limit = 5;
  discount = 90;

  constructor(
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
