import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  course: any;
  lectures: any;
  chapters: any;
  videoUrl!: SafeResourceUrl;
  base_url = 'http://localhost:3000/uploads/courses';

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.uiService.isPlayerSub.next(true);

    const slug = this.route.snapshot.params['id'];
    this.dataService.getCourseBySlug(slug).subscribe(res => {
      this.course = (res as any).data;

      this.dataService.getLecturesByCourseId(this.course._id).subscribe(res => {
        this.lectures = (res as any).data;
      })
    })
  }

  ngOnDestroy(): void {
    this.uiService.isPlayerSub.next(false);
  }

  onClickLecture(lecture: any){
    this.dataService.getChaptersByLectureId(lecture._id).subscribe(res => {
      this.chapters = (res as any).data;
    })
  }

  onClickChapter(chapter: any){
    let unSafeUrl = `${this.base_url}/${this.course._id}/${chapter.file}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
    console.log('videoURL: '+this.videoUrl);
  }
}
