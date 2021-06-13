import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Category} from "../../../../models/category.model";
import {MatTableDataSource} from "@angular/material/table";
import {Subject} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {DataStore} from "../../../../services/data.store";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, tap} from "rxjs/operators";
import {FormControl, FormGroup} from "@angular/forms";
import {Lecture} from "../../../../models/lecture.model";
import {LectureDialogComponent} from "./lecture-dialog/lecture-dialog.component";

@Component({
  selector: 'app-ad-lectures',
  templateUrl: './ad-lectures.component.html',
  styleUrls: ['./ad-lectures.component.css']
})
export class AdLecturesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['position', '_id', 'title', 'options'];
  lectures: Lecture[] = [];
  dataSource = new MatTableDataSource<Lecture>(this.lectures );
  courseId = '';

  dataChanged = new Subject();

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
  }

  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource<Category>(this.categories);
    this.dataSource.paginator = this.paginator;
  }

  private getData() {
    this.courseId = this.route.snapshot.params['id'];
    this.dataStore.getLecturesByCourseId(this.courseId).subscribe(lectures => {
      this.lectures = lectures;
      this.dataSource = new MatTableDataSource<Lecture>(this.lectures );
    })
  }

  create() {
    const dialogRef = this.dialog.open(LectureDialogComponent, {
      width: '20vw',
      data: {courseId: this.courseId, isEdit: false },
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
    const dialogRef = this.dialog.open(LectureDialogComponent, {
      width: '20vw',
      data: { lecture: element, isEdit: true },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      tap(() => this.dataChanged.next())
    )
      .subscribe((res) => {
        console.log("Response: "+ res);

      });
  }

  delete(element: any) {
    // hide category instead of delete it
    const ngForm = new FormGroup({
      isHidden: new FormControl(true)
    })
    this.dataStore.updateLecture(element._id, ngForm.value).subscribe();
  }

  showData(row: any) {
    this.router.navigate(['admin', 'courses', this.courseId, row._id, 'chapters']);
  }
}
