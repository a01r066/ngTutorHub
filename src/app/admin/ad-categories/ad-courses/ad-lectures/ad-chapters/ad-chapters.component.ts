import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Chapter} from "../../../../../models/chapter.model";
import {MatTableDataSource} from "@angular/material/table";
import {Subject} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {DataStore} from "../../../../../services/data.store";
import {filter, tap} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {Category} from "../../../../../models/category.model";
import {FormControl, FormGroup} from "@angular/forms";
import {ChapterDialogComponent} from "./chapter-dialog/chapter-dialog.component";
import {UploadFileDialogComponent} from "./upload-file-dialog/upload-file-dialog.component";
import {Lecture} from "../../../../../models/lecture.model";

@Component({
  selector: 'app-ad-chapters',
  templateUrl: './ad-chapters.component.html',
  styleUrls: ['./ad-chapters.component.css']
})
export class AdChaptersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', '_id', 'title', 'options'];
  chapters: Chapter[] = [];
  dataSource = new MatTableDataSource<Chapter>(this.chapters );

  dataChanged = new Subject();
  lectureId = '';
  courseId = '';
  lecture!: Lecture;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataStore: DataStore,
              public dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getData();
    this.dataChanged.subscribe(() => {
      this.getData();
    })

    this.dataStore.getLectureById(this.lectureId).subscribe(lecture => {
      this.lecture = lecture;
    })
  }

  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource<Category>(this.categories);
    this.dataSource.paginator = this.paginator;
  }

  private getData() {
    this.courseId = this.route.snapshot.params['courseId'];
    this.lectureId = this.route.snapshot.params['lectureId'];
    // this.dataStore.getChaptersByLectureId(this.lectureId).subscribe(chapters => {
    //   this.chapters = chapters;
    //   this.dataSource = new MatTableDataSource<Chapter>(this.chapters );
    // })
  }

  create() {
    const dialogRef = this.dialog.open(ChapterDialogComponent, {
      width: '40vw',
      data: {lectureId: this.lectureId, isEdit: false },
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => this.dataChanged.next())
      )
      .subscribe();
  }

  edit(element: Category) {
    const dialogRef = this.dialog.open(ChapterDialogComponent, {
      width: '40vw',
      data: { chapter: element, isEdit: true },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      tap(() => this.dataChanged.next())
    )
      .subscribe((res) => {
        // console.log("Response: "+ res);
      });
  }

  delete(element: any) {
    // hide category instead of delete it
    this.dataStore.deleteChapter(element._id).subscribe(() => {
      this.dataStore.showSnackBar('Chapter deleted!');
      this.dataChanged.next();
    });
  }

  showData(row: any) {
    this.router.navigate(['admin', 'courses', row.course, 'chapters']);
  }

  uploadFile(element: any) {
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      width: '40vw',
      data: { chapter: element, course: this.courseId, lecture: this.lectureId },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      tap(() => {
        // this.dataChanged.next();
      })
    )
      .subscribe((res) => {
        // console.log("Response: "+ res);
      });
  }
}
