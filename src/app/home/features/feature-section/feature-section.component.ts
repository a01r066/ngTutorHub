import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../../../models/course.model";
import {Constants} from "../../../helpers/constants";
import {Router} from "@angular/router";

@Component({
  selector: 'app-feature-section',
  templateUrl: './feature-section.component.html',
  styleUrls: ['./feature-section.component.css']
})
export class FeatureSectionComponent implements OnInit {
  @Input() courses: Course[] = [];
  @Input() counter!: number;
  page: number = 1;
  freePage: number = 1;
  base_url = `${Constants.base_upload}/courses/`;
  @Input() paginationId!: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.courses = this.courses.reverse();
  }

  getSalePrice(course: any) {
    const tuition = course.tuition;
    const discount = course.coupon.discount;
    return (tuition * (1 - discount/100));
  }

  onClick(course: any){
    this.router.navigate(['course', course.slug]);
  }

  onClickInstructor(instructorId: any) {
    this.router.navigate(['/user', instructorId]);
  }
}
