import { Component, OnInit } from '@angular/core';
import {Course} from "../models/course.model";
import {AuthService} from "../auth/auth.service";
import {DataService} from "../../services/data.service";

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  courses: Course[] = [];
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Vietnam'},
    {value: 'pizza-1', viewValue: 'Malaysia'},
    {value: 'tacos-2', viewValue: 'Singapore'}
  ];

  constructor(private authService: AuthService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchCourses();
  }

  private fetchCourses() {
    const user = this.authService.user;
    if(user.cart.length > 0){
      for(let item of user.cart){
        this.dataService.getCourseById(item.courseId).subscribe(res => {
          const course = (res as any).data;
          this.courses.push(course);
        })
      }
    }
  }

}
