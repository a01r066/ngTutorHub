import { Component, OnInit } from '@angular/core';
import {DataService} from "../../../services/data.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})

export class CourseDetailComponent implements OnInit {
  course: any;
  lectures: any;
  chapters: any;

  panelOpenState = false;

  constructor(private dataService: DataService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.params['id'];
    this.dataService.getCourseBySlug(slug).subscribe(res => {
      this.course = (res as any).data;

      this.dataService.getLecturesByCourseId(this.course._id).subscribe(res => {
        this.lectures = (res as any).data;
        console.log(this.lectures);
      })
    })
  }

  onClickLecture(lecture: any){
    this.dataService.getChaptersByLectureId(lecture._id).subscribe(res => {
      this.chapters = (res as any).data;
      console.log(this.chapters);
    })
  }

  onClickChapter(chapter: any){
    console.log(chapter.title);
  }
}
