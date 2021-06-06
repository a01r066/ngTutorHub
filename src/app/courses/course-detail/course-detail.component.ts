import {Component, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../models/user.model";
import {UiService} from "../../../services/ui.service";
import {Constants} from "../../helpers/constants";
import {Observable} from "rxjs";
import {Course} from "../../models/course.model";
import {Lecture} from "../../models/lecture.model";
import {Chapter} from "../../models/chapter.model";
import {LoadingService} from "../../../services/loading.service";
import {finalize, map} from "rxjs/operators";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})

export class CourseDetailComponent implements OnInit {
  course!: Course;
  lectures$!: Observable<Lecture[]>;
  lectures: Lecture[] = [];

  chapters$!: Observable<Chapter[]>;
  chapters: Chapter[] = [];

  objectives: any;
  videoUrl!: SafeResourceUrl;

  base_url = `${Constants.base_upload}/courses/`;

  isPurchased = false;
  user!: User;

  panelOpenState = false;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private snackBar: MatSnackBar,
              private uiService: UiService,
              private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    const slug = this.route.snapshot.params['id'];
    this.dataService.getCourseBySlug(slug).subscribe(course => {
      this.course = course;

      this.checkCourseIsPurchased(course);
      if(!this.isPurchased){
        // get objectives
        this.objectives = this.course.objectives.substring(1).split('- ');
        this.lectures$ = this.dataService.getLecturesByCourseId(this.course._id);
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
    this.loadingService.loadingOn();
    this.chapters$ = this.dataService.getChaptersByLectureId(lecture._id)
      .pipe(
        map(chapters => chapters),
        finalize(() => {
      this.loadingService.loadingOff();
    }));
  }

  onClickChapter(chapter: any){
    this.router.navigate(['/login']);
  }

  addToCart(course: any){
    if(this.user && !this.isPurchased){
      this.dataService.addToCart(this.authService.user, course).subscribe(res => {
        this.authService.initAuthListener();
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
      this.dataService.addToCart(this.authService.user, course).subscribe(res => {
        this.authService.initAuthListener();
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
