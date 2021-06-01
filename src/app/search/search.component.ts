import { Component, OnInit } from '@angular/core';
import {Course} from "../models/course.model";
import {DataService} from "../../services/data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  base_url = 'http://localhost:3000/uploads/courses/';
  courses: Course[] = [];
  discount = 90;

  constructor(private dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.getCourses().subscribe(res => {
      this.courses = (res as any).data;
    })
  }

  onClick(course: any){
    this.router.navigate(['/course', course.slug]);
  }

  getCoursePrice(course: any){
    return (course.tuition * (1 - this.discount/100));
  }
}
