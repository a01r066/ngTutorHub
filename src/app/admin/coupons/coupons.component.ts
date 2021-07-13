import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {filter, tap} from "rxjs/operators";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {UploadPhotoDialogComponent} from "../ad-categories/ad-courses/upload-photo-dialog/upload-photo-dialog.component";
import {DataStore} from "../../services/data.store";
import {Coupon} from "../../models/coupon.model";
import {CouponDialogComponent} from "./coupon-dialog/coupon-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['position', 'code', 'description', 'discount', 'expire', 'options'];

  coupons: Coupon[] = [];
  dataSource = new MatTableDataSource<Coupon>(this.coupons);

  dataChanged = new Subject();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataStore: DataStore,
              public dialog: MatDialog,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCoupons();
    this.dataChanged.subscribe(() => {
      this.getCoupons();
    })
  }

  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource<Category>(this.categories);
    // this.dataSource.paginator = this.paginator;
  }

  private getCoupons() {
    this.dataStore.getCoupons().subscribe(coupons => {
      this.coupons = coupons;
      this.dataSource = new MatTableDataSource<Coupon>(this.coupons );
      this.dataSource.paginator = this.paginator;
    })
  }

  create() {
    const dialogRef = this.dialog.open(CouponDialogComponent, {
      width: '40vw',
      data: {isEdit: false },
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          this.dataChanged.next();
          this.dataStore.showSnackBar('Coupon created!');
        })
      )
      .subscribe();
  }

  edit(element: Coupon) {
    const dialogRef = this.dialog.open(CouponDialogComponent, {
      width: '40vw',
      data: { element: element, isEdit: true },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      tap(() => {
        this.dataChanged.next();
        this.dataStore.showSnackBar('Coupon updated!');
      })
    )
      .subscribe();
  }

  delete(element: any) {
    // hide category instead of delete it
    const ngForm = new FormGroup({
      isHidden: new FormControl(true)
    })
    this.dataStore.updateCategory(element._id, ngForm.value).subscribe();
  }

  showCourses(row: any) {
    this.router.navigate(['admin', 'categories', (row as any)._id]);
  }

  uploadPhoto(element: any) {
    const dialogRef = this.dialog.open(UploadPhotoDialogComponent, {
      width: '40vw',
      data: { element: element, src: 'category' },
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
}
