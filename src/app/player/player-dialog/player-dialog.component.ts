import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../home/Feedback/feedback.component";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Constants} from "../../helpers/constants";
import {Chapter} from "../../models/chapter.model";

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.css']
})
export class PlayerDialogComponent implements OnInit {
  selected: any;
  chapters: any;
  unSafeUrl!: string;
  videoUrl!: SafeResourceUrl;
  base_url = `${Constants.base_upload}/courses/`;
  courseId: any;
  chapter: any;

  constructor(
    public dialogRef: MatDialogRef<PlayerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.chapters = (this.data as any).chapters;

    this.courseId = (this.data as any).courseId;

    // Get default lesson
    this.chapter = this.chapters[0];
    this.onClickChapter(this.chapter, 0);
  }

  onClickChapter(chapter: any, index: number){
    this.chapter = chapter;
    this.selected = index;

    this.unSafeUrl = `${this.base_url}/${this.courseId}/${chapter.lecture}/${chapter.file}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unSafeUrl);
  }

  getFileExt(chapter: Chapter) {
    const filePath = chapter.file;
    return filePath.substring(filePath.length-3, filePath.length);
  }
}
