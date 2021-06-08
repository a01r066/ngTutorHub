import { Component, OnInit } from '@angular/core';
import {Course} from "../../models/course.model";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../models/user.model";
import {Constants} from "../../helpers/constants";
import {Router} from "@angular/router";

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {
  base_url = `${Constants.base_upload}/courses/`;
  user!: User;
  purchasedCourses: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.getPurchasedCourses();

    this.authService.authChanged.subscribe(isAuth => {
      this.user = this.authService.user;
      this.getPurchasedCourses();
    })
  }

  onClick(course: Course){
    this.router.navigate(['course', course._id]);
  }

  private getPurchasedCourses() {
    this.user.purchased_courses.forEach(course => {
      this.purchasedCourses.push(course);
    })
  }
}
