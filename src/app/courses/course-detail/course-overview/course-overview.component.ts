import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../../../models/course.model";

@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.css']
})
export class CourseOverviewComponent implements OnInit {
  @Input() course!: Course;
  seeMore = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggle(){
    this.seeMore = !this.seeMore;
  }
}
