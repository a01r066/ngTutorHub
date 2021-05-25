import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../../services/data.service";
import {Course} from "../../models/course.model";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  base_url = 'http://localhost:3000/uploads/courses/';

  //slider setting variable
  responsiveOptions: any;

  //define validable to store dynamic products data
  courses: any;

  constructor(private http: HttpClient,
              private dataService: DataService,
              private router: Router,
              private authService: AuthService) {
    //slider responsive settings
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    //get request
    // this.http.get('https://www.testjsonapi.com/products/').subscribe(data => {
    //   //data storing for use in html component
    //   this.products = data;
    // }, error => console.error(error));

    // Get courses request
    this.dataService.getCourses().subscribe(res => {
      this.courses = (res as any).data;
      // console.log(this.courses);
    }, error => console.log(error.message));
  }

  onClick(course: any){
    this.router.navigate(['course', course.slug]);
  }

  ngOnInit(): void {
  }

}
