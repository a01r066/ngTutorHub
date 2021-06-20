import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Observable} from "rxjs";
import {Lecture} from "../models/lecture.model";
import {Chapter} from "../models/chapter.model";
import {DataStore} from "../services/data.store";
import {Constants} from "../helpers/constants";
import {UiService} from "../services/ui.service";
import {Course} from "../models/course.model";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  course: any;

  lecture!: Lecture;
  chapter!: Chapter;
  chaptersArray: any[] = [];
  selected: number = -1;

  unSafeUrl!: string;
  videoUrl!: SafeResourceUrl;
  base_url = `${Constants.base_upload}/courses/`;



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
      this.getChaptersArray(course);
    })
  }

  private getChaptersArray(course: Course) {
    this.dataStore.getLecturesByCourseId(course._id).subscribe(lectures => {
      lectures.forEach(lecture => {
        this.dataStore.getChaptersByLectureId(lecture._id).subscribe(chapters => {
          chapters.sort((c1, c2) => {
            return c1.index - c2.index;
          })

          this.chaptersArray.push({
            index: lecture.index,
            title: lecture.title,
            chapters: chapters
          })
          this.chaptersArray = this.chaptersArray.sort((c1, c2) => {
            return c1.index - c2.index;
          })

          // Set default lesson
          this.chapter = this.chaptersArray[0].chapters[0]
          this.getDefaultLesson(this.chapter);
        })
      })
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

  private getDefaultLesson(chapter: Chapter) {
    this.unSafeUrl = `${this.base_url}/${this.course._id}/${chapter.lecture}/${chapter.file}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unSafeUrl);
  }

  getFileExt(chapter: Chapter) {
    const filePath = chapter.file;
    return filePath.substring(filePath.length-3, filePath.length);
  }

  onClickChapter(chapter: any, index: number){
    this.chapter = chapter;
    this.selected = index;

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

  home() {
    this.uiService.isPlayerSub.next(false);
    this.router.navigate(['home', 'my-courses', 'learning']);
  }
}
