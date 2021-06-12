import {NgModule} from "@angular/core";
import { AdCategoriesComponent } from './ad-categories/ad-categories.component';
import { AdCoursesComponent } from './ad-categories/ad-courses/ad-courses.component';
import { AdLecturesComponent } from './ad-categories/ad-courses/ad-lectures/ad-lectures.component';
import { AdChaptersComponent } from './ad-categories/ad-courses/ad-lectures/ad-chapters/ad-chapters.component';
import {ShareModule} from "../share.module";
import {AdminRoutingModule} from "./admin-routing.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryDialogComponent } from './ad-categories/category-dialog/category-dialog.component';
import { CourseDialogComponent } from './ad-categories/ad-courses/course-dialog/course-dialog.component';
import { LectureDialogComponent } from './ad-categories/ad-courses/ad-lectures/lecture-dialog/lecture-dialog.component';
import { ChapterDialogComponent } from './ad-categories/ad-courses/ad-lectures/ad-chapters/chapter-dialog/chapter-dialog.component';

@NgModule({
  declarations: [
    AdCategoriesComponent,
        AdCoursesComponent,
        AdLecturesComponent,
        AdChaptersComponent,
        DashboardComponent,
        CategoryDialogComponent,
        CourseDialogComponent,
        LectureDialogComponent,
        ChapterDialogComponent,
  ],
  imports: [
    ShareModule,
    AdminRoutingModule
  ]
})

export class AdminModule {
}
