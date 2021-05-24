import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  panelOpenState = false;
  course: any;
  lectures: any;
  chapters: any;
  videoUrl!: SafeResourceUrl;
  base_url = 'http://localhost:3000/uploads/courses';

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) { }

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
    let unSafeUrl = `${this.base_url}/${this.course._id}/${chapter.file}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
  }
}
