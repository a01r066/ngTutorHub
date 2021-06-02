import { Component, OnInit } from '@angular/core';
import {DataService} from "../../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})

export class CourseDetailComponent implements OnInit {
  course: any;
  lectures: any;
  chapters: any;
  demoChapters: any;
  objectives: any;
  videoUrl!: SafeResourceUrl;
  base_url = 'http://localhost:3000/uploads/courses';

  isPurchased = false;
  user!: User;

  panelOpenState = false;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user = this.authService.user;

    const slug = this.route.snapshot.params['id'];
    this.dataService.getCourseBySlug(slug).subscribe(res => {
      this.course = (res as any).data;

      this.checkCourseIsPurchased(this.course);
      if(!this.isPurchased){
        // get objectives
        this.objectives = this.course.objectives.substring(1).split('- ');

        this.dataService.getLecturesByCourseId(this.course._id).subscribe(res => {
          this.lectures = (res as any).data;

          // Demo lecture
          const demoLecture = this.lectures[0];
          this.dataService.getChaptersByLectureId(demoLecture._id).subscribe(res => {
            this.demoChapters = (res as any).data;
            // console.log('demoChapters: '+this.demoChapters[0].title);
            let unSafeUrl = `${this.base_url}/${this.course._id}/${this.demoChapters[0].file}`;
            this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
          })
        })
      }
    })
  }

  onClickLecture(lecture: any){
    this.dataService.getChaptersByLectureId(lecture._id).subscribe(res => {
      this.chapters = (res as any).data;
    })
  }

  onClickChapter(chapter: any){
    this.router.navigate(['/login']);
  }

  addToCart(course: any){
    if(this.user && !this.isPurchased){
      this.dataService.addToCart(this.authService.user, course).subscribe(res => {
        this.authService.getCurrentUser();
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
        this.authService.getCurrentUser();
        this.router.navigate(['checkout']);
      });
      this.snackBar.open(`${course.title} added to cart!`, null!, {
        duration: 3000
      })
    } else {
      this.router.navigate(['/login']);
    }
  }

  private checkCourseIsPurchased(course: any) {
    const purchasedCourses = this.user.purchased_courses;
    for(let res of purchasedCourses){
      const pCourse = (res as any).courseId;
      if(pCourse._id === course._id){
        this.isPurchased = true;
        return
      }
    }
  }
}
