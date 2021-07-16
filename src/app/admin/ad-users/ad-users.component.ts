import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Subject} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {DataStore} from "../../services/data.store";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InstructorDialogComponent} from "../ad-instructors/instructor-dialog/instructor-dialog.component";
import {filter, tap} from "rxjs/operators";
import {UploadPhotoDialogComponent} from "../ad-categories/ad-courses/upload-photo-dialog/upload-photo-dialog.component";
import {User} from "../../models/user.model";
import * as moment from "moment";
import {UserDialogComponent} from "./user-dialog/user-dialog.component";

@Component({
  selector: 'app-ad-users',
  templateUrl: './ad-users.component.html',
  styleUrls: ['./ad-users.component.css']
})
export class AdUsersComponent implements OnInit {

  displayedColumns: string[] = ['position', 'displayName', 'email', 'courses', 'createdAt', 'options'];
  objects: User[] = [];
  dataSource = new MatTableDataSource<User>(this.objects);

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
    this.dataStore.getUsers().subscribe(objects => {
      this.objects = objects;
      this.dataSource = new MatTableDataSource<User>(this.objects );
      this.dataSource.paginator = this.paginator;
    })
  }

  create() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
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

  delete(element: any) {

  }

  edit(element: any) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
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
