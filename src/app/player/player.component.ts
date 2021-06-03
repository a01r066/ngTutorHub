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
  unSafeUrl!: string;
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
