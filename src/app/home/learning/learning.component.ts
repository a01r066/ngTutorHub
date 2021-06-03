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
  base_url = 'http://18.117.94.38:3000/uploads/';
  user!: User;
  purchasedCourses: any[] = [];

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.getPurchasedCourses();
  }

  onClick(course: Course){
    console.log('Clicked: '+course.title);
  }

  private getPurchasedCourses() {
    this.user.purchased_courses.forEach(course => {
      this.purchasedCourses.push(course);
    })
  }
}
