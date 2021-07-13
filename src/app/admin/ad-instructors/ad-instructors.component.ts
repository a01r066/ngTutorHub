import {Component, OnInit, ViewChild} from '@angular/core';
import {Coupon} from "../../models/coupon.model";
import {MatTableDataSource} from "@angular/material/table";
import {Subject} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {Instructor} from "../../models/instructor.model";
import {DataStore} from "../../services/data.store";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoryDialogComponent} from "../ad-categories/category-dialog/category-dialog.component";
import {filter, tap} from "rxjs/operators";
import {InstructorDialogComponent} from "./instructor-dialog/instructor-dialog.component";
import {UploadPhotoDialogComponent} from "../ad-categories/ad-courses/upload-photo-dialog/upload-photo-dialog.component";

@Component({
  selector: 'app-ad-instructors',
  templateUrl: './ad-instructors.component.html',
  styleUrls: ['./ad-instructors.component.css']
})
export class AdInstructorsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'courses', 'options'];
  objects: Instructor[] = [];
  dataSource = new MatTableDataSource<Instructor>(this.objects);

  dataChanged = new Subject();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private dataStore: DataStore,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getObjects();
    this.dataChanged.subscribe(() => {
      this.getObjects();
    })
  }

  private getObjects() {
    this.dataStore.getAllInstructors().subscribe(objects => {
      this.objects = objects;
      this.dataSource = new MatTableDataSource<Instructor>(this.objects );
      this.dataSource.paginator = this.paginator;
    })
  }

  create() {
    const dialogRef = this.dialog.open(InstructorDialogComponent, {
      width: '40vw',
      data: {isEdit: false },
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          this.dataChanged.next();
          this.dataStore.showSnackBar('Instructor created!');
        })
      )
      .subscribe();
  }

  show(element: any) {

  }

  uploadPhoto(element: any) {
    const dialogRef = this.dialog.open(UploadPhotoDialogComponent, {
      width: '40vw',
      data: { element: element, src: 'instructor' },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      tap(() => {
        // this.dataChanged.next();
      })
    )
      .subscribe();
  }

  delete(element: any) {

  }

  edit(element: any) {
    const dialogRef = this.dialog.open(InstructorDialogComponent, {
      width: '40vw',
      data: {element: element, isEdit: true },
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          this.dataChanged.next();
          this.dataStore.showSnackBar('Instructor updated!');
        })
      )
      .subscribe();
  }
}
