import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {DecimalPipe} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Constants} from "../helpers/constants";
import {DataStore} from "../services/data.store";
import {AuthStore} from "../services/auth.store";

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit, AfterViewInit {
  courses: any;
  coursesId: any[] = [];
  base_url = `${Constants.base_upload}/courses/`;

  user!: User;
  items: any[] = [];
  purchase_units!: any;

  totalPrice = 0;
  salePrice = 0;
  priceDiscounted = 0;

  // Paypal
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  paidFor = false;

  constructor(private authStore: AuthStore,
              private dataStore: DataStore,
              private router: Router,
              private _decimalPipe: DecimalPipe,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.authStore.user$.subscribe(user => {
      this.user = user;
      this.fetchCourses();
    })
  }

  ngAfterViewInit(): void {
    this.createPaypalButton();
  }

  private fetchCourses() {
    if (this.user.cart.length > 0) {
      this.courses = this.user.cart;

      // Get cost summary
      this.getSalePrice();
      this.getPurchaseUnits();
    }
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
          "value": this.getValue(this.salePrice),
          "breakdown": {
            "item_total": {
              "currency_code": "USD",
              "value": this.getValue(this.salePrice)
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

  checkout(payment: any){
    this.dataStore.checkout(payment).subscribe(res => {

      this.authStore.initAuthListener();

      // Clear cart
      this.courses = this.user.cart;
      // this.getSummary();
      this.getSalePrice();
      if((res as any).success === true){
        this.router.navigate(['home/my-courses/learning']);
      } else {
        this.router.navigate(['']);
      }
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
            "totalPrice": this.getValue(this.salePrice)
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

  addToAdmin() {
    const payment = {
      "user": this.user._id,
      "courses": this.coursesId,
      "totalPrice": this.getValue(this.salePrice)
    }
    this.checkout(payment);
  }

  getDiscountedPrice(course: any){
    const tuition = course.courseId.tuition;
    const discount = course.courseId.coupon.discount;
    return (tuition * (1 - discount/100));
  }

  getSalePrice() {
    this.salePrice = 0;
    this.totalPrice = 0;
    this.priceDiscounted = 0;

    for(let course of this.courses){
      const tuition = course.courseId.tuition;
      this.totalPrice += tuition;
      const discount = course.courseId.coupon.discount;
      const sale = tuition * (1 - discount/100);
      this.salePrice += sale;

      this.coursesId.push({ "courseId": course.courseId._id});
    }

    this.getPriceDiscounted();
  }

  getPriceDiscounted() {
    this.priceDiscounted = this.totalPrice - this.salePrice;
  }
}
