import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items = ["Development", "Business", "Finance & Accounting", "IT & Software", "Learning English", "Marketing"];

  constructor() { }

  ngOnInit(): void {
  }

}
