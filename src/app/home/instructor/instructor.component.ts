import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
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

  constructor(
    private route: ActivatedRoute,
    private dataStore: DataStore
  ) { }

  ngOnInit(): void {
    const instructorId = this.route.snapshot.params['instructorId'];
    this.instructor$ = this.dataStore.getInstructor(instructorId);
  }
}
