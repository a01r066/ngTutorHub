import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../../models/category.model";
import {DataStore} from "../../services/data.store";
import {MatDialog} from "@angular/material/dialog";
import {CategoryDialogComponent} from "./category-dialog/category-dialog.component";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {filter, tap} from "rxjs/operators";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-ad-categories',
  templateUrl: './ad-categories.component.html',
  styleUrls: ['./ad-categories.component.css']
})
export class AdCategoriesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', '_id', 'title', 'options'];
  categories: Category[] = [];
  dataSource = new MatTableDataSource<Category>(this.categories );

  dataChanged = new Subject();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataStore: DataStore,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.getCategories();
    this.dataChanged.subscribe(() => {
     this.getCategories();
    })
  }

  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource<Category>(this.categories);
    this.dataSource.paginator = this.paginator;
  }

  private getCategories() {
    this.dataStore.categories$.subscribe(categories => {
      this.categories = categories;
      this.dataSource = new MatTableDataSource<Category>(this.categories );
    })
  }

  create() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '20vw',
      data: {isEdit: false },
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
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '20vw',
      data: { category: element, isEdit: true },
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      tap(() => this.dataChanged.next())
    )
      .subscribe();
  }

  delete(element: Category) {
    // hide category instead of delete it
    const ngForm = new FormGroup({
      isHidden: new FormControl(true)
    })
    this.dataStore.updateCategory(element._id, ngForm.value).subscribe();
  }

  showCourses(row: any) {
    this.router.navigate(['admin', 'categories', (row as any)._id]);
  }
}
