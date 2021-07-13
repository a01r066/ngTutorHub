import {Component, OnInit, ViewChild} from '@angular/core';
import {DataStore} from "../../../services/data.store";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Course} from "../../../models/course.model";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseDialogComponent} from "./course-dialog/course-dialog.component";
import {Observable, Subject} from "rxjs";
import {UploadPhotoDialogComponent} from "./upload-photo-dialog/upload-photo-dialog.component";
import {Instructor} from "../../../models/instructor.model";
import {FormControl, FormGroup} from "@angular/forms";
import {InstructorDialogComponent} from "../../ad-instructors/instructor-dialog/instructor-dialog.component";

@Component({
  selector: 'app-ad-courses',
  templateUrl: './ad-courses.component.html',
  styleUrls: ['./ad-courses.component.css']
})
export class AdCoursesComponent implements OnInit {
  displayedColumns: string[] = ['position', '_id', 'title', 'instructor', 'isPublished', 'options'];
  courses: Course[] = [];
  dataSource = new MatTableDataSource<Course>(this.courses);
  categoryId!: any;
  isPublished: Boolean = false;
  instructors$!: Observable<Instructor[]>;

  dataChanged = new Subject();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngForm!: FormGroup;

  constructor(private dataStore: DataStore,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.getCourses();
    this.instructors$ = this.dataStore.getAllInstructors();

    this.dataChanged.subscribe(() => {
      this.getCourses();
    })

    this.ngForm = new FormGroup({
      instructor: new FormControl()
    })
  }

  private getCourses() {
    this.categoryId = this.route.snapshot.params['id'];
    this.dataStore.getCoursesByCategory(this.categoryId).subscribe(courses => {
      this.courses = courses;
      // this.courses = courses.filter(course => course.category === this.categoryId);
      this.dataSource = new MatTableDataSource<Course>(this.courses);
      this.dataSource.paginator = this.paginator;
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

  onToggle($event: any, idx: number) {
    this.dataStore.updateCourse(this.courses[idx]._id, { isPublished: $event.checked}).subscribe(() => {
      console.log('Course is updated!');
    });
  }

  onSelectChange($event: any, element: Course) {
    this.dataStore.updateCourse(element._id, this.ngForm.value).subscribe();
    this.dataStore.addToInstructorCourses($event.value, element._id).subscribe();
  }

  addInstructor() {
    const dialogRef = this.dialog.open(InstructorDialogComponent, {
      width: '40vw',
      data: { isEdit: false },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.dataChanged.next();
    });
  }
}
