import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {DataService} from "../services/data.service";
import {Course} from "../models/course.model";
import {Router} from "@angular/router";
import {User} from "../models/user.model";
import {Constants} from "../helpers/constants";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  courses: any;
  base_url = `${Constants.base_upload}/courses/`;

  originalPrice = 0;
  discountedAmount = 0;
  remainAmount = 0;
  discount = 90;
  percentageOff = 0;
  user!: User;

  constructor(private authService: AuthService,
              private dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    if(this.user){
      this.fetchCourses();
    }
  }

  private fetchCourses() {
    this.user = this.authService.user;
    if(this.user.cart.length > 0){
      this.courses = this.user.cart;

      // Get summary
      this.getSummary();
    }
  }

  removeCourse(index: any){
    this.dataService.removeCartItem(this.courses[index].courseId._id).subscribe(res => {
      this.courses.splice(index, 1);
      this.getSummary();
    });
  }

  checkoutCart(){
    this.router.navigate(['checkout']);
  }

  private getSummary() {
    this.originalPrice = 0;
    this.discountedAmount = 0;
    this.remainAmount = 0;
    this.percentageOff = 0;

    for(let course of this.courses){
      this.calculate(course);
    }
  }

  private calculate(course: any){
    this.originalPrice += course.courseId.tuition;
    this.remainAmount = this.originalPrice * (1 - this.discount/100);
    this.percentageOff = (1 - (this.remainAmount/this.originalPrice))*100;
  }

  getDiscountedPrice(course: any){
    return (course.courseId.tuition * (1 - this.discount/100));
  }

  getPrice(course: any){
    return course.courseId.tuition;
  }
}
