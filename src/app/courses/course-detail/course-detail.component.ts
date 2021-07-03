import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {User} from "../../models/user.model";
import {Constants} from "../../helpers/constants";
import {BehaviorSubject, Observable} from "rxjs";
import {Course} from "../../models/course.model";
import {Lecture} from "../../models/lecture.model";
import {Chapter} from "../../models/chapter.model";
import {DataStore} from "../../services/data.store";
import {AuthStore} from "../../services/auth.store";
import {MatDialog} from "@angular/material/dialog";
import {FacebookService, InitParams, UIParams, UIResponse} from "ngx-facebook";
import {PlayerDialogComponent} from "../../player/player-dialog/player-dialog.component";
import {filter, tap} from "rxjs/operators";
import * as moment from "moment";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})

export class CourseDetailComponent implements OnInit {
  course: any;
  lecture!: Lecture;
  chapter!: Chapter;
  chapterCounter: number = 0;
  downloadableCounter: number = 0;
  zipCounter = 0;

  chaptersArray: any[] = [];
  selected: number = -1;

  objectives: any;

  unSafeUrl!: string;
  videoUrl!: SafeResourceUrl;
  base_url = `${Constants.base_upload}/courses/`;

  private subject = new BehaviorSubject<boolean>(false);
  isPurchased$: Observable<boolean> = this.subject.asObservable();
  user!: User;

  seeMore = false;
  discount: number = 0;
  width: number = 25;

  isWishlist = false;
  shareUrl: string = 'https://api.tutorhub.info:3000/share/';

  play: any;

  constructor(
    private dataStore: DataStore,
    private route: ActivatedRoute,
    public authStore: AuthStore,
    private router: Router,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private fb: FacebookService) {
    const initParams: InitParams = {
      appId: '468210474239699',
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams).then();
  }

  ngOnInit(): void {
    this.getWidth();
    const slug = this.route.snapshot.params['id'];
    this.dataStore.getCourseBySlug(slug).subscribe(course => {
      this.shareUrl += course._id;

      this.course = course;
      this.getSalePrice(course);
      this.objectives = course.objectives.substring(1).split('- ');

      this.getChaptersArray(course);

      this.authStore.user$.subscribe(user => {
        this.user = user;
        if(user){
          this.checkCourseIsPurchased(course);
          this.checkIsWishlist(course);
        }
      })
    });
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

          // Get summary
          this.getSummary(this.chaptersArray);
          this.play = 'play_circle_outline';
        })
      })
    })
  }

  private getDefaultLesson(chapter: Chapter) {
    this.unSafeUrl = `${this.base_url}/${this.course._id}/${chapter.lecture}/${chapter.file}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unSafeUrl);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getWidth();
  }

  private getWidth() {
    const size = window.innerWidth;
    if(size < 1024){
      this.width = 0;
    } else {
      this.width = 25;
    }
  }

  getSalePrice(course: any) {
    const tuition = course.tuition;
    const discount = course.coupon.discount;
    return (tuition * (1 - discount/100));
  }

  toggle(){
    this.seeMore = !this.seeMore;
  }

  private checkCourseIsPurchased(course: any) {
    const purchasedCourses = this.user.purchased_courses;
    for(let res of purchasedCourses){
      const pCourse = (res as any).courseId;
      if(pCourse._id === course._id){
        this.subject.next(true);
        return
      }
    }
  }

  getFileExt(chapter: Chapter) {
    const filePath = chapter.file;
    if(typeof filePath !== "undefined"){
      return filePath.substring(filePath.length-3, filePath.length);
    } else {
      return '';
    }
  }

  addToCart(course: any){
    if(this.user){
      this.dataStore.addToCart(this.user._id, course._id).subscribe(res => {
        this.authStore.initAuthListener();
      });
      this.dataStore.showSnackBar(`${course.title} added to cart!`);
    } else {
     this.router.navigate(['login']);
    }
  }

  buyNow(course: any) {
    if(this.user){
      this.dataStore.addToCart(this.user._id, course._id).subscribe(res => {
        this.authStore.initAuthListener();
        this.router.navigate(['checkout']);
      });
      this.dataStore.showSnackBar(`${course.title} added to cart!`);
    } else {
      this.router.navigate(['login']);
    }
  }

  goToCourse(course: Course) {
    this.router.navigate(['course', course.slug, 'learn']);
  }

  addToWishlist(course: Course) {
    this.isWishlist = !this.isWishlist;
    this.dataStore.updateWishlist(this.user._id, course._id).subscribe(() => {
      this.authStore.initAuthListener();
    });
  }

  private checkIsWishlist(course: any) {
    const wishlist = (this.user.wishlist) as any;
    for(let item of wishlist){
      if(item.courseId._id === course._id){
        this.isWishlist = true;
        return;
      }
    }
  }

  share() {
    const params: UIParams = {
      href: this.shareUrl,
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));
  }

  private getSummary(chaptersArray: any[]) {
    this.downloadableCounter = 0;
    this.zipCounter = 0;
    this.chapterCounter = 0;

    for(let item of chaptersArray){
      const chapters = (item as any).chapters;
      for(let chapter of chapters){
        if(chapter.zip.length > 0){
          this.zipCounter++;
        }
        const filePath = chapter.file;
        if(typeof filePath !== "undefined"){
          const ext = filePath.substring(filePath.length - 3, filePath.length);
          if(ext === 'mp4'){
            this.chapterCounter++;
          } else if(ext === 'pdf' || ext === 'zip'){
            this.downloadableCounter++;
          }
        }
      }
    }
  }

  preview() {
    const dialogRef = this.dialog.open(PlayerDialogComponent, {
      width: '600px',
      data: { chapters: this.chaptersArray[0].chapters, courseId: this.course._id },
      autoFocus: false,
      // panelClass: 'dialog-container-custom'
    });

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
        })
      )
      .subscribe();
  }

  enrollNow(course: any) {
    if(!this.user){
      this.router.navigate(['signup']);
    } else {
      const payment = {
        "user": this.user._id,
        "courses": [{"courseId": course._id}],
        "totalPrice": 0
      }
      this.checkout(payment);
    }
  }

  checkout(payment: any){
    this.dataStore.checkout(payment).subscribe(res => {
      this.authStore.initAuthListener();
      this.goToCourse(this.course);
    })
  }

  formatTime(time: number) {
    const format: string = 'mm:ss';
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }
}
