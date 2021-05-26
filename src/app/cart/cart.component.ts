import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User} from "../models/user.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: string[] = [];
  courses: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    for(let item of this.authService.user.cart.items){
      this.cartItems.push(item.courseId);
    }
  }
}
