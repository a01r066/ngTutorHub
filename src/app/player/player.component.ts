import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {Subject} from "rxjs";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  course: any;
  lecture!: Lecture;

  chaptersArray: any[] = [];
  defaultSub = new Subject<any[]>();
  // unSafeUrl!: string;
  // videoUrl!: SafeResourceUrl;
  base_url = `${Constants.base_upload}/courses/`;
  shareUrl: string = 'https://api.tutorhub.info:3000/share/';

  isHidden: boolean = false;
  user!: User;

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
  chapter!: Chapter;

  currentVideo!: any;
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
    this.defaultSub.subscribe(defaultChaptersArray => {
      this.getPlayedTrack(this.course, defaultChaptersArray);
    })
  }

  getPlayedTrack(course: Course, defaultChaptersArray: any[]){
    this.dataStore.getTracker(this.user._id, course._id).subscribe(data => {
      this.activeIndex = data.chapterIndex;
      this.activeLectureIndex = data.lectureIndex;
      for(let chapter of defaultChaptersArray[data.lectureIndex].chapters){
        this.videoItems.push({
          name: chapter.title,
          src: `${this.base_url}/${this.course._id}/${chapter.lecture}/${chapter.file}`
        })
      }
      this.currentVideo = this.videoItems[data.chapterIndex];
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

          this.defaultSub.next(this.chaptersArray);
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
      this.activeIndex++;
      this.currentVideo = this.videoItems[this.activeIndex];
      this.addTrackerToDB(this.chapter, this.activeIndex, this.activeLectureIndex);
    }
  }

  initVdo() {
    // this.data.play();
    this.data.getDefaultMedia().currentTime = 0;
    this.data.pause();
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
    this.chapter = chapter;
    this.activeIndex = chapterIndex;
    this.activeLectureIndex = lectureIndex;

    this.getVideoItems(lectureIndex);

    this.currentVideo = this.videoItems[chapterIndex];
    this.addTrackerToDB(chapter, chapterIndex, lectureIndex);
  }

  getSafeURL(src: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  downloadFile(chapter: Chapter) {
    window.location.href = `${this.base_url}/${this.course._id}/${chapter.lecture}/${chapter.zip}`;
  }
}
