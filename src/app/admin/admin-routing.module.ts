import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AdCategoriesComponent} from "./ad-categories/ad-categories.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AdminComponent} from "./admin.component";
import {AdCoursesComponent} from "./ad-categories/ad-courses/ad-courses.component";
import {AdLecturesComponent} from "./ad-categories/ad-courses/ad-lectures/ad-lectures.component";
import {AdChaptersComponent} from "./ad-categories/ad-courses/ad-lectures/ad-chapters/ad-chapters.component";
import {CouponsComponent} from "./coupons/coupons.component";
import {AdInstructorsComponent} from "./ad-instructors/ad-instructors.component";

const routes: Routes = [
  { path: 'admin', component: AdminComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: AdCategoriesComponent },
      { path: 'categories/:id', component: AdCoursesComponent },
      { path: 'courses/:id', component: AdLecturesComponent },
      { path: 'courses/:courseId/:lectureId/chapters', component: AdChaptersComponent },
      { path: 'coupons', component: CouponsComponent },
      { path: 'instructors', component: AdInstructorsComponent }
    ] }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminRoutingModule {

}
