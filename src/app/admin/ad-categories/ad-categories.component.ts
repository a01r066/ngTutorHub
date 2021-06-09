import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../../models/category.model";
import {DataStore} from "../../services/data.store";
import {MatDialog} from "@angular/material/dialog";
import {CategoryDialogComponent} from "./category-dialog/category-dialog.component";
import {DataService} from "../../services/data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-ad-categories',
  templateUrl: './ad-categories.component.html',
  styleUrls: ['./ad-categories.component.css']
})
export class AdCategoriesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', '_id', 'title', 'options'];
  categories: Category[] = [];
  dataSource = new MatTableDataSource<Category>(this.categories);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataStore: DataStore,
              public dialog: MatDialog,
              private dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataStore.categories$.subscribe(categories => {
      this.categories = categories;
    })
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Category>(this.categories);
    this.dataSource.paginator = this.paginator;
  }

  edit(element: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '20vw',
      data: { category: element, isEdit: true },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.user = result;
    });
  }

  delete(element: Category) {
    // hide category instead of delete it
    this.dataService.updateCategory(element._id, { "isHidden": true }).subscribe(res => {
      console.log(res);
    });
  }

  create() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '20vw',
      data: {isEdit: false },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.user = result;
    });
  }

  showCourses(row: any) {
    console.log('row: '+JSON.stringify(row));
    this.router.navigate(['admin', 'categories', (row as any)._id]);
  }
}
