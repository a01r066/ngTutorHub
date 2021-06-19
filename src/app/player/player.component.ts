import {AfterViewInit, Component, HostListener, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Observable} from "rxjs";
import {Lecture} from "../models/lecture.model";
import {Chapter} from "../models/chapter.model";
import {DataStore} from "../services/data.store";
import {Constants} from "../helpers/constants";
import {UiService} from "../services/ui.service";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  course: any;
  lectures$!: Observable<Lecture[]>;
  chapters: Chapter[] = [];
  unSafeUrl!: string;
  videoUrl!: SafeResourceUrl;
  // base_url = 'http://localhost:3000/uploads/courses';
  base_url = `${Constants.base_upload}/courses/`;
  isVideo: boolean = true;

  constructor(
              private dataStore: DataStore,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private uiService: UiService,
              private router: Router) { }

  ngOnInit(): void {
    this.uiService.isPlayerSub.next(true);
    const slug = this.route.snapshot.params['id'];
    this.dataStore.getCourseBySlug(slug).subscribe(course => {
      this.course = course;

      this.lectures$ = this.dataStore.getLecturesByCourseId(this.course._id);
      this.getSampleLesson();
    })
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // console.log('Back button pressed');
    this.uiService.isPlayerSub.next(false);
  }

  ngOnDestroy(): void {
    this.uiService.isPlayerSub.next(false);
  }

  private getSampleLesson() {
    this.lectures$.subscribe(lectures => {
      const firstLecture = lectures[0];
      this.dataStore.getChaptersByLectureId(firstLecture._id).subscribe(chapters => {
        this.chapters = chapters.sort((c1, c2) => {
          return parseInt(c1.index) - parseInt(c2.index);
        })
        const chapter = this.chapters[0];
        this.unSafeUrl = `${this.base_url}/${this.course._id}/${chapter.lecture}/${chapter.file}`;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unSafeUrl);
        this.isVideoChecker(this.unSafeUrl);
      });
    })
  }

  onClickLecture(lecture: any){
    this.chapters = [];
    this.dataStore.getChaptersByLectureId(lecture._id).subscribe(chapters => {
      this.chapters = chapters.sort((c1, c2) => {
        return parseInt(c1.index) - parseInt(c2.index);
      })
    });
  }

  onClickChapter(chapter: any){
    this.unSafeUrl = `${this.base_url}/${this.course._id}/${chapter.lecture}/${chapter.file}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unSafeUrl);
    this.isVideoChecker(this.unSafeUrl);

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

  home() {
    this.uiService.isPlayerSub.next(false);
    this.router.navigate(['home', 'my-courses', 'learning']);
  }

  private isVideoChecker(videoUrl: string) {
    const ext = videoUrl.substring(videoUrl.length-3, videoUrl.length);
    this.isVideo = ext === 'mp4';
  }
}
