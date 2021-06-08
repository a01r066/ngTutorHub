import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  links = ['Categories']
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  showInfo(link: any) {

  }

  dashboard() {
    this.router.navigate(['admin/dashboard']);
  }

  home() {
    this.router.navigate(['']);
  }
}
