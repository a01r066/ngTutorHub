import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {DataService} from "../../services/data.service";
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {DecimalPipe} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit, AfterViewInit {
  courses: any;
  coursesId: string[] = [];
  base_url = 'http://18.117.94.38:3000/uploads/courses/';

  originalPrice = 0;
  discountedAmount = 0;
  remainAmount = 0;
  discount = 90;
  percentageOff = 0;
  user!: User;
  items: any[] = [];
  purchase_units!: any;

  // Paypal
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  paidFor = false;

  isDataFetched = new Subject();

  constructor(private authService: AuthService,
              private dataService: DataService,
              private router: Router,
              private _decimalPipe: DecimalPipe,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.user = this.authService.user;
    if(this.user){
      this.fetchCourses();
    }

    this.authService.authChanged.subscribe(isAuth => {
      this.user = this.authService.user;
      this.fetchCourses();
    })
  }

  ngAfterViewInit(): void {
    this.createPaypalButton();
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
      this.coursesId.push(course.courseId._id);
    }

    this.getPurchaseUnits();
  }

  getValue(value: number): number {
    // @ts-ignore
    let valueStr = this._decimalPipe.transform(value, "1.0-0").toString();
    valueStr = valueStr.replace(',', '');
   return parseInt(valueStr);
  }

  getPurchaseUnits(){
    this.purchase_units = [
      {
        "reference_id": "PUHF",
        "description": "TuturHub Courses",
        "custom_id": "CUST-HighFashions",
        "soft_descriptor": "HighFashions",
        "amount": {
          "currency_code": "USD",
          "value": this.getValue(this.remainAmount),
          "breakdown": {
            "item_total": {
              "currency_code": "USD",
              "value": this.getValue(this.remainAmount)
            },
            "shipping": {
              "currency_code": "USD",
              "value": "0"
            },
            "handling": {
              "currency_code": "USD",
              "value": "0"
            },
            "tax_total": {
              "currency_code": "USD",
              "value": "0"
            },
            "shipping_discount": {
              "currency_code": "USD",
              "value": "0"
            }
          }
        },
        "items": this.items,
          // [
          //   {
          //     "name": "T-Shirt",
          //     "description": "Green XL",
          //     "sku": "sku01",
          //     "unit_amount": {
          //       "currency_code": "USD",
          //       "value": "900.00"
          //     },
          //     "tax": {
          //       "currency_code": "USD",
          //       "value": "100.00"
          //     },
          //     "quantity": "1",
          //     "category": "PHYSICAL_GOODS"
          //   }
          // ],
        "shipping": {
          "method": "United States Postal Service",
          "address": {
            "name": {
              "full_name": "John",
              "surname": "Doe"
            },
            "address_line_1": "123 Townsend St",
            "address_line_2": "Floor 6",
            "admin_area_2": "San Francisco",
            "admin_area_1": "CA",
            "postal_code": "94107",
            "country_code": "US"
          }
        }
      }]
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

  checkout(payment: any){
    this.dataService.checkout(payment).subscribe(res => {
      // console.log((res as any).data);
      this.authService.getCurrentUser();

      // Clear cart
      this.courses = this.user.cart;
      this.getSummary();
      // if((res as any).success === true){
      //   this.router.navigate(['home/my-courses/learning']);
      // } else {
      //   this.router.navigate(['']);
      // }
    })
  }

  private createPaypalButton() {
    // Paypal
    paypal
      .Buttons({
        createOrder: (
          data: any, actions: any) => {
          return actions.order.create({
            purchase_units: this.purchase_units
            //   [
            //   {
            //     description: this.product.description,
            //     amount: {
            //       currency_code: 'USD',
            //       value: this.product.price
            //     }
            //   }
            // ]
          });
        },
        onApprove: async (data: any, actions: { order: { capture: () => any; }; }) => {
          const order = await actions.order.capture();
          this.paidFor = true;
          // console.log(order);
          // complete payment & update data to server
          const payment = {
            "user": this.user._id,
            "courses": this.coursesId,
            "totalPrice": this.getValue(this.remainAmount)
          }
          this.checkout(payment);
        },
        onError: (err: any) => {
          // console.log(err);
          this.snackBar.open(`Error: ${err.message}`, null!, {
            duration: 3000
          })
        }
      })
      .render(this.paypalElement.nativeElement);
  }
}
