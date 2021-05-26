import { Component, OnInit } from '@angular/core';
import {DataService} from "../../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})

export class CourseDetailComponent implements OnInit {
  course: any;
  lectures: any;
  chapters: any;
  isAuthenticated!: boolean;
  objectives: any;
  videoUrl!: SafeResourceUrl;
  base_url = 'http://localhost:3000/uploads/courses';
  isPurchased = false;

  panelOpenState = false;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  this.isAuthenticated = this.authService.isAuthenticated;

    const slug = this.route.snapshot.params['id'];
    this.dataService.getCourseBySlug(slug).subscribe(res => {
      this.course = (res as any).data;

      // get objectives
      this.objectives = this.course.objectives.substring(1).split('- ');

      this.dataService.getLecturesByCourseId(this.course._id).subscribe(res => {
        this.lectures = (res as any).data;
      })
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
    if(this.isAuthenticated && !this.isPurchased){
      this.dataService.addToCart(course).subscribe(res => {
        console.log(res);
      });
      this.snackBar.open(`${course.title} added to cart!`, null!, {
        duration: 3000
      })
    } else {
      this.router.navigate(['/login']);
    }
  }
}
