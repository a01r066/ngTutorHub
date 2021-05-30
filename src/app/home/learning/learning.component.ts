import { Component, OnInit } from '@angular/core';
import {Course} from "../../models/course.model";
import {AuthService} from "../../auth/auth.service";
import {DataService} from "../../../services/data.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {
  courses: Course[] = [];
  base_url = 'http://localhost:3000/uploads/categories/';
  user!: User;
  purchasedCourses: any;

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.getPurchasedCourses(this.user);
  }

  onClick(course: Course){
    console.log('Clicked: '+course.title);
  }

  private getPurchasedCourses(user: User) {

  }
}
