import {NgModule} from "@angular/core";
import { AdCategoriesComponent } from './ad-categories/ad-categories.component';
import { AdCoursesComponent } from './ad-categories/ad-courses/ad-courses.component';
import { AdLecturesComponent } from './ad-categories/ad-courses/ad-lectures/ad-lectures.component';
import { AdChaptersComponent } from './ad-categories/ad-courses/ad-lectures/ad-chapters/ad-chapters.component';
import {ShareModule} from "../share.module";
import {AdminRoutingModule} from "./admin-routing.module";
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AdCategoriesComponent,
        AdCoursesComponent,
        AdLecturesComponent,
        AdChaptersComponent,
        DashboardComponent,
  ],
  imports: [
    ShareModule,
    AdminRoutingModule
  ]
})

export class AdminModule {

}
