import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataStore} from "../../../services/data.store";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Course} from "../../../models/course.model";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseDialogComponent} from "./course-dialog/course-dialog.component";
import {Subject} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {UploadPhotoDialogComponent} from "./upload-photo-dialog/upload-photo-dialog.component";

@Component({
  selector: 'app-ad-courses',
  templateUrl: './ad-courses.component.html',
  styleUrls: ['./ad-courses.component.css']
})
export class AdCoursesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', '_id', 'category_id', 'title', 'options'];
  courses: Course[] = [];
  dataSource = new MatTableDataSource<Course>(this.courses);
  categoryId!: any;

  dataChanged = new Subject();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataStore: DataStore,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.getCourses();

    this.dataChanged.subscribe(() => {
      this.getCourses();
    })
  }

  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource<Course>(this.courses);
    this.dataSource.paginator = this.paginator;
  }

  private getCourses() {
    this.categoryId = this.route.snapshot.params['id'];
    this.dataStore.courses$.subscribe(courses => {
      this.courses = courses.filter(course => course.category === this.categoryId);
      this.dataSource = new MatTableDataSource<Course>(this.courses);
    })
  }

  edit(element: Course) {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '40vw',
      data: { course: element, isEdit: true },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
     this.dataChanged.next();
    });
  }

  create() {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '40vw',
      data: {categoryId: this.categoryId, isEdit: false},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.user = result;
    });
  }

  delete(element: any) {
    // hide category instead of delete it
    this.dataStore.deleteCourse(element._id).subscribe();
  }

  showLectures(row: any) {
    this.router.navigate(['admin', 'courses', row._id]);
  }

  uploadPhoto(element: any) {
    const dialogRef = this.dialog.open(UploadPhotoDialogComponent, {
      width: '40vw',
      data: { element: element, src: 'course'},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.dataChanged.next();
    });
  }
}
