import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataStore} from "../../../services/data.store";
import {MatDialog} from "@angular/material/dialog";
import {DataService} from "../../../services/data.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {CategoryDialogComponent} from "../category-dialog/category-dialog.component";
import {Course} from "../../../models/course.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ad-courses',
  templateUrl: './ad-courses.component.html',
  styleUrls: ['./ad-courses.component.css']
})
export class AdCoursesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', '_id', 'category_id', 'title', 'options'];
  courses: Course[] = [];
  dataSource = new MatTableDataSource<Course>(this.courses);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataStore: DataStore,
              public dialog: MatDialog,
              private dataService: DataService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    const categoryId = this.route.snapshot.params['id'];
    this.dataStore.courses$.subscribe(courses => {
      this.courses = courses.filter(course => course.category === categoryId);
    })
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Course>(this.courses);
    this.dataSource.paginator = this.paginator;
  }

  edit(element: Course) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '20vw',
      data: { course: element, isEdit: true },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.user = result;
    });
  }

  delete(element: Course) {
    // hide category instead of delete it
    this.dataService.updateCategory(element._id, { "isHidden": true }).subscribe(res => {
      console.log(res);
    });
  }

  create() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '20vw',
      data: {isEdit: false},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.user = result;
    });
  }

  showLectures(row: any) {

  }
}
