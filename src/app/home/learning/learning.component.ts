import { Component, OnInit } from '@angular/core';
import {Constants} from "../../helpers/constants";
import {Router} from "@angular/router";
import {AuthStore} from "../../services/auth.store";

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {
  base_url = `${Constants.base_upload}/courses/`;
  purchasedCourses: any[] = [];

  constructor(
    private authStore: AuthStore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe(user => {
      user.purchased_courses.forEach(course => {
        this.purchasedCourses.push(course);
      })
    })
  }

  onClick(course: any){
    this.router.navigate(['course', course.courseId.slug, 'learn']);
  }
}
