import {Component, OnInit} from '@angular/core';
import {Constants} from "../../helpers/constants";
import {Router} from "@angular/router";
import {AuthStore} from "../../services/auth.store";
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css'],
})
export class LearningComponent implements OnInit {
  base_url = `${Constants.base_upload}/courses/`;
  purchasedCourses: any[] = [];
  wishlistCourses: any[] = [];
  activeIndex = 0;
  items = ['All courses', 'Wishlist'];
  page: number = 1;

  constructor(
    private authStore: AuthStore,
    private router: Router,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe(user => {
      if(user.purchased_courses){
        this.purchasedCourses = [];
        user.purchased_courses.forEach(item => {
          this.purchasedCourses.push(item.courseId);
        })
        this.purchasedCourses.reverse();
      }

      if(user.wishlist){
        this.wishlistCourses = [];
        user.wishlist.forEach(item => {
          this.wishlistCourses.push(item.courseId);
        })
        this.wishlistCourses.reverse();
      }
    })
  }

  onClick(course: any){
    this.uiService.isPlayerSub.next(true);
    this.router.navigate(['course', course.slug, 'learn']);
  }

  onClickTab(index: number) {
    this.activeIndex = index;
  }

  onClickWishlistCourse(course: any) {
    this.router.navigate(['/course', course.slug]);
  }
}
