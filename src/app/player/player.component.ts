import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UiService} from "../../services/ui.service";
import {Observable} from "rxjs";
import {Lecture} from "../models/lecture.model";
import {LoadingService} from "../../services/loading.service";
import {Chapter} from "../models/chapter.model";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  course: any;
  loadingLectures$!: Observable<Lecture[]>;
  loadingChapters$!: Observable<Chapter[]>;
  unSafeUrl!: string;
  videoUrl!: SafeResourceUrl;
  base_url = 'http://localhost:3000/uploads/courses';

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private uiService: UiService,
              private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.uiService.isPlayerSub.next(true);

    const slug = this.route.snapshot.params['id'];
    this.dataService.getCourseBySlug(slug).subscribe(course => {
      this.course = course;

      const lectures$ = this.dataService.getLecturesByCourseId(this.course._id);
      this.loadingLectures$ = this.loadingService.showLoaderUntilCompleted(lectures$);
    })
  }

  ngOnDestroy(): void {
    this.uiService.isPlayerSub.next(false);
  }

  onClickLecture(lecture: any){
    const chapters$ = this.dataService.getChaptersByLectureId(lecture._id);
    this.loadingChapters$ = this.loadingService.showLoaderUntilCompleted(chapters$);
  }

  onClickChapter(chapter: any){
    this.unSafeUrl = `${this.base_url}/${this.course._id}/${chapter.file}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unSafeUrl);
    // this.getVideoDuration();
  }

//   getVideoDuration(){
//     // Create a non-dom allocated Audio element
//     const au = document.createElement('video');
//
// // Define the URL of the MP3 audio file
//     au.src = this.unSafeUrl;
//
// // Once the metadata has been loaded, display the duration in the console
//     au.addEventListener('loadedmetadata', () => {
//       // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
//       const duration = au.duration;
//       console.log('Duration: '+duration);
//
//       // example 12.3234 seconds
//       // console.log("The duration of the song is of: " + durationStr + " seconds");
//       // Alternatively, just display the integer value with
//       // parseInt(duration)
//       // 12 seconds
//     });
//   }
}
