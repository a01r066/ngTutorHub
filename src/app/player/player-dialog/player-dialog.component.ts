import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../home/Feedback/feedback.component";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Constants} from "../../helpers/constants";
import {Chapter} from "../../models/chapter.model";
import * as moment from "moment";
import slugify from "slugify";

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.css']
})
export class PlayerDialogComponent implements OnInit {
  chapters: any;
  courseId: any;

  isVideo: boolean = true;
  base_url = `${Constants.base_upload}/courses/`;
  streamPath = this.base_url;
  currentUrl: any = '';
  playerData: any;
  safeUrl!: SafeResourceUrl;
  videoItems: any = [
    // {
    //   name: 'Video two',
    //   src: 'http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov',
    //   type: 'video/mp4'
    // }
  ];
  activeIndex = 0;

  constructor(
    public dialogRef: MatDialogRef<PlayerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.chapters = (this.data as any).chapters;
    this.courseId = (this.data as any).courseId;

    // Play default chapter
    this.getVideoItems();
  }

  formatTime(time: number) {
    const format: string = 'mm';
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  initVdo() {
    this.playerData.getDefaultMedia().currentTime = 0;
    this.playerData.play();
  }

  // Video player
  videoPlayerInit(data: any) {
    this.playerData = data;
    this.playerData.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVdo.bind(this));
  }

  getSafeURL(src: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  getVideoItems(){
    for(let chapter of this.chapters){
      this.videoItems.push({
        name: chapter.title,
        src: `${this.base_url}/${this.courseId}/${chapter.lecture}/${chapter.file}`
      })
    }

    setTimeout(() => {
      this.startPlaylistVdo(this.chapters[0], 0);
    }, 1000);
  }

  startPlaylistVdo(chapter: Chapter, chapterIndex: number) {
    if(chapter.file.slice(chapter.file.length-3) === 'mp4'){
      this.isVideo = true;
      this.streamPath = this.base_url;
      this.activeIndex = chapterIndex;
      const ct = this.videoItems[chapterIndex].name;
      const title = slugify(ct, { replacement: '_' });
      this.streamPath += `${this.courseId}/${chapter.lecture}/${title}/index.m3u8`;
    } else {
      this.isVideo = false;
      this.currentUrl = this.videoItems[chapterIndex].src;
      this.safeUrl = this.getSafeURL(this.currentUrl);
    }
  }
}
