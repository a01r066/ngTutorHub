import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataStore} from "../../../services/data.store";
import {MatDialog} from "@angular/material/dialog";
import {DataService} from "../../../services/data.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Course} from "../../../models/course.model";
import {ActivatedRoute} from "@angular/router";
import {CourseDialogComponent} from "./course-dialog/course-dialog.component";
import {Subject} from "rxjs";

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
              private dataService: DataService,
              private route: ActivatedRoute) { }

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
      width: '35vw',
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
      width: '35vw',
      data: {categoryId: this.categoryId, isEdit: false},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.user = result;
    });
  }

  delete(element: Course) {
    // hide category instead of delete it
    this.dataService.updateCategory(element._id, { "isHidden": true }).subscribe(res => {
      // console.log(res);
    });
  }

  showLectures(row: any) {

  }
}
