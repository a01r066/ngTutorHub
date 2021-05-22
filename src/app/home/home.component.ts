import {Component, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items = ["Development", "Business", "Finance & Accounting", "IT & Software", "Learning English", "Marketing"];
  activeItem = this.items[0];

  selectedIndex = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onClick(i: number){
    console.log("Clicked: "+i);
    this.selectedIndex = i;
    this.activeItem = this.items[i];
  }

}
