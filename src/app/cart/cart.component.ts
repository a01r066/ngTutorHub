import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {DataService} from "../../services/data.service";
import {Course} from "../models/course.model";
import {User} from "../models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  courses: Course[] = [];

  constructor(private authService: AuthService,
              private dataService: DataService,
              private router: Router) { }

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

  removeCourse(index: any){
    this.dataService.removeCartItem(this.courses[index]).subscribe(res => {
      this.authService.getCurrentUser();
    });
    this.courses.splice(index, 1);
  }

  checkoutCart(){
    this.router.navigate(['checkout']);
  }
}
