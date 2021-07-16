import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  links = ['Categories', 'Coupons', 'Instructors', 'Users']
  icons = ['menu', 'redeem', 'school', 'manage_accounts'];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  showInfo(index: any) {
    this.router.navigate(['admin', this.links[index].toLowerCase()]);
  }

  dashboard() {
    this.router.navigate(['admin/dashboard']);
  }

  home() {
    this.router.navigate(['']);
  }
}
