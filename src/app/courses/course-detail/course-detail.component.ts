import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../models/user.model";
import {UiService} from "../../services/ui.service";
import {Constants} from "../../helpers/constants";
import {Observable} from "rxjs";
import {Course} from "../../models/course.model";
import {Lecture} from "../../models/lecture.model";
import {Chapter} from "../../models/chapter.model";
import {map} from "rxjs/operators";
import {DataStore} from "../../services/data.store";
import {AuthStore} from "../../services/auth.store";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})

export class CourseDetailComponent implements OnInit {
  course!: Course;
  lectures$!: Observable<Lecture[]>;
  chapters$!: Observable<Chapter[]>;

  objectives: any;
  videoUrl!: SafeResourceUrl;

  base_url = `${Constants.base_upload}/courses/`;

  isPurchased = false;
  user!: User;

  panelOpenState = false;

  constructor(
              private dataStore: DataStore,
              private route: ActivatedRoute,
              public authStore: AuthStore,
              private router: Router,
              private sanitizer: DomSanitizer,
              private snackBar: MatSnackBar,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe(user => {
      this.user = user;
    })
    const slug = this.route.snapshot.params['id'];
    this.dataStore.getCourseBySlug(slug).subscribe(course => {
      this.course = course;

      this.checkCourseIsPurchased(course);
      if(!this.isPurchased){
        // get objectives
        this.objectives = this.course.objectives.substring(1).split('- ');
        this.lectures$ = this.dataStore.getLecturesByCourseId(this.course._id);
      }
    });
  }

  private checkCourseIsPurchased(course: any) {
    const purchasedCourses = this.user.purchased_courses;
    for(let res of purchasedCourses){
      const pCourse = (res as any).courseId;
      if(pCourse._id === course._id){
        this.isPurchased = true;
        this.uiService.isCoursePurchased.next(true);
        return
      }
    }
  }

  onClickLecture(lecture: any){
    this.chapters$ = this.dataStore.getChaptersByLectureId(lecture._id)
      .pipe(map(chapters => chapters));
  }

  onClickChapter(chapter: any){
    this.router.navigate(['/login']);
  }

  addToCart(course: any){
    if(this.user && !this.isPurchased){
      this.dataStore.addToCart(this.user._id, course._id).subscribe(res => {
        this.authStore.initAuthListener();
      });
      this.snackBar.open(`${course.title} added to cart!`, null!, {
        duration: 3000
      })
    } else {
      this.router.navigate(['/login']);
    }
  }

  buyNow(course: any) {
    if(this.user && !this.isPurchased){
      this.dataStore.addToCart(this.user._id, course._id).subscribe(res => {
        this.authStore.initAuthListener();
        this.router.navigate(['checkout']);
      });
      this.snackBar.open(`${course.title} added to cart!`, null!, {
        duration: 3000
      })
    } else {
      this.router.navigate(['/login']);
    }
  }
}
