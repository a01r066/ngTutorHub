import { Component, OnInit } from '@angular/core';
import {Course} from "../models/course.model";
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UiService} from "../../services/ui.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  base_url = 'http://18.117.94.38:3000/uploads/courses/';
  loadingCourses!: Observable<Course[]>;
  discount = 90;
  searchText!: string;
  limit = 5;

  constructor(private dataService: DataService,
              private router: Router,
              private uiService: UiService,
              private route: ActivatedRoute,
              private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.route.queryParams
      .pipe()
      .subscribe(params => {
          // console.log(params.q); // popular
          this.searchText = params.q;
          const courses$ = this.dataService.getCoursesBySearchText(this.searchText, this.limit);
          this.loadingCourses = this.loadingService.showLoaderUntilCompleted(courses$);
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
