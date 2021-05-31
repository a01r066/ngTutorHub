import {Component, OnInit} from '@angular/core';
import {Category} from "../models/category.model";
import {DataService} from "../../services/data.service";

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
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getTopCategories().subscribe(res => {
      this.categories = (res as any).data;
    })
  }

  onClick(i: number){
    this.selectedIndex = i;
    this.activeItem = this.categories[i];

  }
}
