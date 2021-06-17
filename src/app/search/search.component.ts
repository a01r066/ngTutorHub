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
  discount = 90;
  page: number = 1;

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

  getSalePrice(course: any) {
    const tuition = course.tuition;
    const discount = course.coupon.discount;
    return (tuition * (1 - discount/100));
  }

  onClick(course: any){
    this.router.navigate(['/course', course.slug]);
  }
}
