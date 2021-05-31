import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  categories: any;
  @Input() isAuth = false;
  @Input() user!: User;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getCategories().subscribe(res => {
      this.categories = (res as any).data;
    })
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['']);
  }

  onClickCart(){
    if(this.isAuth){
      this.router.navigate(['/cart']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
