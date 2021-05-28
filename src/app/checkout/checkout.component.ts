import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {DataService} from "../../services/data.service";
import {User} from "../models/user.model";

declare var paypal: any;

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

  // Paypal
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  product = {
    price: 777.77,
    description: 'used couch, decent condition',
    img: 'assets/couch.jpg'
  };

  paidFor = false;

  constructor(private authService: AuthService,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.fetchCourses();

    // Paypal
    paypal
      .Buttons({
        createOrder: (data: any, actions: { order: { create: (arg0: { purchase_units: { description: string; amount: { currency_code: string; value: number; }; }[]; }) => any; }; }) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.product.description,
                amount: {
                  currency_code: 'USD',
                  value: this.product.price
                }
              }
            ]
          });
        },
        onApprove: async (data: any, actions: { order: { capture: () => any; }; }) => {
          const order = await actions.order.capture();
          this.paidFor = true;
          console.log(order);
        },
        onError: (err: any) => {
          console.log(err);
        }
      })
      .render(this.paypalElement.nativeElement);
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
