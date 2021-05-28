import { Component, OnInit } from '@angular/core';
import {Course} from "../models/course.model";
import {AuthService} from "../auth/auth.service";
import {DataService} from "../../services/data.service";
import {User} from "../models/user.model";

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
  courses: any;
  base_url = 'http://localhost:3000/uploads/courses/';

  originalPrice = 0;
  discountedAmount = 0;
  remainAmount = 0;
  discount = 90;
  percentageOff = 0;
  user!: User;

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Vietnam'},
    {value: 'pizza-1', viewValue: 'Malaysia'},
    {value: 'tacos-2', viewValue: 'Singapore'}
  ];

  constructor(private authService: AuthService,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.fetchCourses();
  }

  private fetchCourses() {
    this.user = this.authService.user;
    if (this.user.cart.length > 0) {
      this.courses = this.user.cart;

      // Get cost summary
      this.getSummary();
    }
  }

  private getSummary() {
    for(let course of this.courses){
      this.calculate(course);
    }
  }

  private calculate(course: any){
    this.originalPrice += course.courseId.tuition;
    this.discountedAmount = this.originalPrice * this.discount/100;
    this.remainAmount = this.originalPrice * (1 - this.discount/100);
    this.percentageOff = (1 - (this.remainAmount/this.originalPrice))*100;
  }

  getDiscountedPrice(course: any){
    return (course.courseId.tuition * (1 - this.discount/100));
  }

  getPrice(course: any){
    return course.courseId.tuition;
  }

  checkout(){
    let coursesId = [];
    for(let course of this.courses){
      coursesId.push(course.courseId._id);
    }
    console.log('CoursesId: '+ coursesId);
    const paymentInfo = {
      "userId": this.user._id,
      "courses": coursesId,
      "total": this.remainAmount
    }

    this.dataService.checkout(paymentInfo).subscribe(res => {
      console.log(res);
    })
  }
}
