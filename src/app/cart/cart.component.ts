import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../models/user.model";
import {Constants} from "../helpers/constants";
import {DataStore} from "../services/data.store";
import {AuthStore} from "../services/auth.store";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  courses: any;
  base_url = `${Constants.base_upload}/courses/`;
  totalPrice = 0;
  salePrice = 0;

  user!: User;

  constructor(private authStore: AuthStore,
              private dataStore: DataStore,
              private router: Router) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe(user => {
      this.user = user;
      this.fetchCourses();
    })
  }

  private fetchCourses() {
    if(this.user.cart.length > 0){
      this.courses = this.user.cart;

      // Get summary
      this.getSalePrice();
    }
  }

  removeCourse(index: any){
    this.dataStore.removeCartItem(this.courses[index].courseId._id, this.user._id).subscribe(res => {
      this.courses.splice(index, 1);
      this.getSalePrice();
    });
  }

  checkoutCart(){
    this.router.navigate(['checkout']);
  }

  getDiscountedPrice(course: any){
    const tuition = course.courseId.tuition;
    const discount = course.courseId.coupon.discount;
    return (tuition * (1 - discount/100));
  }

  getSalePrice() {
    this.salePrice = 0;
    this.totalPrice = 0;

    for(let course of this.courses){
      const tuition = course.courseId.tuition;
      this.totalPrice += tuition;
      const discount = course.courseId.coupon.discount;
      const sale = tuition * (1 - discount/100);
      this.salePrice += sale;
    }
  }

  getPercentageOff() {
    return (1 - (this.salePrice/this.totalPrice))*100;
  }
}
