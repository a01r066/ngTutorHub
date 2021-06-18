import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {User} from "../../models/user.model";
import {Constants} from "../../helpers/constants";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Course} from "../../models/course.model";
import {Lecture} from "../../models/lecture.model";
import {Chapter} from "../../models/chapter.model";
import {map} from "rxjs/operators";
import {DataStore} from "../../services/data.store";
import {AuthStore} from "../../services/auth.store";
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})

export class CourseDetailComponent implements OnInit {
  courseSubject = new Subject<Course>();
  course!: Course;
  lectures$!: Observable<Lecture[]>;
  // chapters$!: Observable<Chapter[]>;
  chapters: Chapter[] = [];

  objectives: any;

  unSafeUrl!: string;
  videoUrl!: SafeResourceUrl;

  base_url = `${Constants.base_upload}/courses/`;

  private subject = new BehaviorSubject<boolean>(false);
  isPurchased$: Observable<boolean> = this.subject.asObservable();
  user!: User;

  panelOpenState = false;

  seeMore = false;
  discount: number = 0;
  width: number = 25;

  constructor(
    private dataStore: DataStore,
    private route: ActivatedRoute,
    public authStore: AuthStore,
    private router: Router,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getWidth();
    const slug = this.route.snapshot.params['id'];
    this.dataStore.getCourseBySlug(slug).subscribe(course => {
      // get objectives
      this.courseSubject.next(course);
      this.course = course;

      this.getSalePrice(course);

      this.objectives = course.objectives.substring(1).split('- ');
      this.lectures$ = this.dataStore.getLecturesByCourseId(course._id);
      this.getSampleLesson();
    });

    this.courseSubject.subscribe(course => {
      this.authStore.user$.subscribe(user => {
        this.user = user;
        if(user){
          this.checkCourseIsPurchased(course);
        }
      })
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getWidth();
  }

  private getWidth() {
    const size = window.innerWidth;
    if(size < 1024){
      this.width = 0;
    } else {
      this.width = 25;
    }
  }

  getSalePrice(course: any) {
    const tuition = course.tuition;
    const discount = course.coupon.discount;
    return (tuition * (1 - discount/100));
  }

  toggle(){
    this.seeMore = !this.seeMore;
  }

  private getSampleLesson() {
    this.lectures$.subscribe(lectures => {
      const firstLecture = lectures[0];
      this.dataStore.getChaptersByLectureId(firstLecture._id).subscribe(chapters => {
        this.chapters = chapters.sort((c1, c2) => {
          return parseInt(c1.index) - parseInt(c2.index);
        })
        const firstChapter = chapters[0];
        this.unSafeUrl = `${this.base_url}/${this.course._id}/${firstChapter.lecture}/${firstChapter.file}`;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unSafeUrl);
      });
    })
  }

  private checkCourseIsPurchased(course: any) {
    const purchasedCourses = this.user.purchased_courses;
    for(let res of purchasedCourses){
      const pCourse = (res as any).courseId;
      if(pCourse._id === course._id){
        this.subject.next(true);
        return
      }
    }
  }

  onClickLecture(lecture: any){
    this.dataStore.getChaptersByLectureId(lecture._id).subscribe(chapters => {
      this.chapters = chapters.sort((c1, c2) => {
        return parseInt(c1.index) - parseInt(c2.index);
      })
    });
}

  onClickChapter(chapter: any){
    // this.router.navigate(['/login']);
  }

  addToCart(course: any){
    if(this.user){
      this.dataStore.addToCart(this.user._id, course._id).subscribe(res => {
        this.authStore.initAuthListener();
      });
      this.dataStore.showSnackBar(`${course.title} added to cart!`);
    } else {
     this.router.navigate(['login']);
    }
  }

  buyNow(course: any) {
    if(this.user){
      this.dataStore.addToCart(this.user._id, course._id).subscribe(res => {
        this.authStore.initAuthListener();
        this.router.navigate(['checkout']);
      });
      this.dataStore.showSnackBar(`${course.title} added to cart!`);
    } else {
      this.router.navigate(['login']);
    }
  }

  goToCourse(course: Course) {
    this.router.navigate(['course', course.slug, 'learn']);
  }
}
