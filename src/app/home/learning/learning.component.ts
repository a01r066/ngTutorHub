import {Component, OnInit, ViewEncapsulation} from '@angular/core';
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
  activeIndex = 0;
  items = ['All courses', 'Wishlist'];

  constructor(
    private authStore: AuthStore,
    private router: Router,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe(user => {
      this.purchasedCourses = [];
      user.purchased_courses.forEach(course => {
        this.purchasedCourses.push(course);
      })
    })
  }

  onClick(course: any){
    this.uiService.isPlayerSub.next(true);
    this.router.navigate(['course', course.courseId.slug, 'learn']);
  }

  onClickTab(index: number) {
    this.activeIndex = index;
  }
}
