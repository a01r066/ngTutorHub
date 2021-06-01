import {Component, OnInit} from '@angular/core';
import {Category} from "../models/category.model";
import {DataService} from "../../services/data.service";
import {Subject, Subscription} from "rxjs";
import {UiService} from "../../services/ui.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  activeItem = this.categories[0];

  selectedIndex = 0;

  constructor(
    private dataService: DataService,
    private uiService: UiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataService.getTopCategories().subscribe(res => {
      this.categories = (res as any).data;
      this.uiService.categoriesSub.next(this.categories);
    })
  }

  onClick(i: number){
    this.uiService.tabSelectedIndexSub.next(i);
    this.selectedIndex = i;
    this.activeItem = this.categories[i];
  }
}
