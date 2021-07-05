import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {Lecture} from "../models/lecture.model";
import {Chapter} from "../models/chapter.model";
import {DataStore} from "../services/data.store";
import {Constants} from "../helpers/constants";
import {UiService} from "../services/ui.service";
import {Course} from "../models/course.model";
import {FacebookService, InitParams, UIParams, UIResponse} from "ngx-facebook";
import {User} from "../models/user.model";
import {AuthStore} from "../services/auth.store";
import {MatAccordion} from "@angular/material/expansion";
import * as moment from "moment";
import slugify from "slugify";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy{
  course: any;
  lecture!: Lecture;

  chaptersArray: any[] = [];
  // unSafeUrl!: string;
  // videoUrl!: SafeResourceUrl;
  base_url = `${Constants.base_upload}/courses/`;
  streamPath = this.base_url;
  shareUrl: string = 'https://api.tutorhub.info:3000/share/';

  isHidden: boolean = false;
  user!: User;
  isVideo: boolean = true;
  size!: any;

  @ViewChild('Mat-Accordion') matAccordion!: MatAccordion;

  videoItems: any = [
    // {
    //   name: 'Video two',
    //   src: 'http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov',
    //   type: 'video/mp4'
    // }
  ];

  activeIndex = 0;
  activeLectureIndex = 0;
  selectedChapter!: Chapter;

  // currentVideo!: any;
  currentUrl: any = '';
  data: any;

  constructor(
              private dataStore: DataStore,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private uiService: UiService,
              private router: Router,
              private fb: FacebookService,
              private authStore: AuthStore) {
    const initParams: InitParams = {
      appId: '468210474239699',
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams).then();
  }

  ngOnInit(): void {
    this.uiService.isPlayerSub.next(true);
    const slug = this.route.snapshot.params['id'];
    this.dataStore.getCourseBySlug(slug).subscribe(course => {
      this.course = course;
      this.getChaptersArray(course);
    })
    this.authStore.user$.subscribe(user => this.user = user);
    this.getSize();
  }

  getPlayedTrack(course: Course){
    this.dataStore.getTracker(this.user._id, course._id).subscribe(data => {
      this.activeIndex = data.chapterIndex;
      this.activeLectureIndex = data.lectureIndex;
      this.dataStore.getLectureById(data.lecture).subscribe(lecture => {
        this.dataStore.getChaptersByLectureId(data.lecture).subscribe(chapters => {
          chapters.sort((c1, c2) => {
            return c1.index - c2.index;
          })

          this.videoItems = [];
          for(let chapter of chapters){
            this.videoItems.push({
              name: chapter.title,
              src: `${this.base_url}/${this.course._id}/${chapter.lecture}/${chapter.file}`
            })
          }
          this.selectedChapter = chapters[this.activeIndex];
          if(this.selectedChapter.file.slice(this.selectedChapter.file.length-3) === 'mp4'){
            this.isVideo = true;
            const ct = this.videoItems[this.activeIndex].name;
            const title = slugify(ct, { replacement: '_' });
            this.streamPath += `${this.course._id}/${data.lecture}/${title}/index.m3u8`;
          } else {
            this.isVideo = false;
            this.currentUrl = this.videoItems[data.chapterIndex].src;
          }
        })
      })
      // this.currentVideo = this.videoItems[0];
    })
  }

  private getChaptersArray(course: Course) {
    this.dataStore.getLecturesByCourseId(course._id).subscribe(lectures => {
      lectures.sort((l1, l2) => {
        return l1.index - l2.index
      })

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
        })
      })
    })

    this.getPlayedTrack(this.course);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // console.log('Back button pressed');
    this.uiService.isPlayerSub.next(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getSize();
  }

  ngOnDestroy(): void {
    this.uiService.isPlayerSub.next(false);
  }

  getFileExt(chapter: Chapter) {
    let path = chapter.file;
    return path.slice(path.length-3);
  }

  private addTrackerToDB(chapter: any, chapterIndex: number, lectureIndex: number) {
    const formData = {
      "user": this.user._id,
      "course" : this.course._id,
      "data": {
        "lecture": chapter.lecture,
        "chapter": chapter._id,
        "lectureIndex" : lectureIndex,
        "chapterIndex" : chapterIndex
      }
    }

    this.dataStore.addTracker(formData).subscribe(() => {
    })
  }

  home() {
    this.uiService.isPlayerSub.next(false);
    this.router.navigate(['home', 'my-courses', 'learning']);
  }

  toggle() {
    this.isHidden = !this.isHidden;
  }

  share() {
    this.shareUrl += this.course._id;
    const params: UIParams = {
      href: this.shareUrl,
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));
  }

  // Video player
  videoPlayerInit(data: any) {
    this.data = data;
    this.data.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVdo.bind(this));
    this.data.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
  }

  nextVideo() {
    if(this.activeIndex < this.videoItems.length-1){
      this.streamPath = this.base_url;
      this.activeIndex++;

      this.selectedChapter = this.chaptersArray[this.activeLectureIndex].chapters[this.activeIndex];
      if(this.selectedChapter.file.slice(this.selectedChapter.file.length-3) === 'mp4'){
        this.isVideo = true;
        // this.currentVideo = this.videoItems[this.activeIndex];
        const ct = this.videoItems[this.activeIndex].name;
        const title = slugify(ct, { replacement: '_' });
        this.streamPath += `${this.course._id}/${this.selectedChapter.lecture}/${title}/index.m3u8`;
      } else {
        this.isVideo = false;
        this.currentUrl = this.videoItems[this.activeIndex].src;
      }

      this.addTrackerToDB(this.selectedChapter, this.activeIndex, this.activeLectureIndex);
    }
  }

  initVdo() {
    this.data.getDefaultMedia().currentTime = 0;
    this.data.play();
    // this.data.pause();
  }

  getVideoItems(index: number){
    this.videoItems = [];
    if(this.chaptersArray.length > 0){
      for(let chapter of this.chaptersArray[index].chapters){
        this.videoItems.push({
          name: chapter.title,
          src: `${this.base_url}/${this.course._id}/${chapter.lecture}/${chapter.file}`
        })
      }
    }
  }

  startPlaylistVdo(chapter: Chapter, chapterIndex: number, lectureIndex: number) {
    this.getVideoItems(lectureIndex);

    if(chapter.file.slice(chapter.file.length-3) === 'mp4'){
      this.isVideo = true;
      this.streamPath = this.base_url;

      this.selectedChapter = chapter;
      this.activeIndex = chapterIndex;
      this.activeLectureIndex = lectureIndex;

      // this.currentVideo = this.videoItems[chapterIndex];
      const ct = this.videoItems[chapterIndex].name;
      const title = slugify(ct, { replacement: '_' });
      this.streamPath += `${this.course._id}/${chapter.lecture}/${title}/index.m3u8`;
    } else {
      this.isVideo = false;
      this.currentUrl = this.videoItems[chapterIndex].src;
      console.log('currentUrl: '+this.currentUrl);
    }
    this.addTrackerToDB(chapter, chapterIndex, lectureIndex);
  }

  getSafeURL(src: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  downloadFile(chapter: Chapter) {
    window.location.href = `${this.base_url}/${this.course._id}/${chapter.lecture}/${chapter.zip}`;
  }

  formatTime(time: number) {
    const format: string = 'mm';
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  private getSize() {
    this.size = window.innerWidth;
    this.size > 990 ? this.isHidden = false : this.isHidden = true;
  }
}
