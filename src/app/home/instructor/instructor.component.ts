import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataStore} from "../../services/data.store";
import {Observable} from "rxjs";
import {Instructor} from "../../models/instructor.model";
import {Constants} from "../../helpers/constants";

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  instructor$!: Observable<Instructor>;
  path = `${Constants.base_upload}/instructors/`;
  base_url = `${Constants.base_upload}/courses/`;
  courses!: any[];

  constructor(
    private route: ActivatedRoute,
    private dataStore: DataStore,
    private router: Router
  ) { }

  ngOnInit(): void {
    const instructorId = this.route.snapshot.params['instructorId'];
    this.instructor$ = this.dataStore.getInstructor(instructorId);

    this.instructor$.subscribe(instructor => {
      this.courses = instructor.courses;
    })
  }

  getSalePrice(course: any) {
    const tuition = course.courseId.tuition;
    const discount = course.courseId.coupon.discount;
    return (tuition * (1 - discount/100));
  }

  onClick(course: any) {
    this.router.navigate(['course', course.courseId.slug]);
  }
}
