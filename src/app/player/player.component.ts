import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UiService} from "../services/ui.service";
import {Observable} from "rxjs";
import {Lecture} from "../models/lecture.model";
import {Chapter} from "../models/chapter.model";
import {DataStore} from "../services/data.store";
import {Constants} from "../helpers/constants";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  course: any;
  lectures$!: Observable<Lecture[]>;
  chapters$!: Observable<Chapter[]>;
  unSafeUrl!: string;
  videoUrl!: SafeResourceUrl;
  // base_url = 'http://localhost:3000/uploads/courses';
  base_url = `${Constants.base_upload}/courses/`;

  constructor(
              private dataStore: DataStore,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.uiService.isPlayerSub.next(true);

    const slug = this.route.snapshot.params['id'];
    this.dataStore.getCourseBySlug(slug).subscribe(course => {
      this.course = course;

      this.lectures$ = this.dataStore.getLecturesByCourseId(this.course._id);
    })
  }

  ngOnDestroy(): void {
    this.uiService.isPlayerSub.next(false);
  }

  onClickLecture(lecture: any){
    this.chapters$ = this.dataStore.getChaptersByLectureId(lecture._id);
  }

  onClickChapter(chapter: any){
    this.unSafeUrl = `${this.base_url}/${this.course._id}/${chapter.lecture}/${chapter.file}`;
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
