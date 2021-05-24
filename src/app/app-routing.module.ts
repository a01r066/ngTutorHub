import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {CoursesComponent} from "./courses/courses.component";
import {CourseListComponent} from "./courses/course-list/course-list.component";
import {CourseDetailComponent} from "./courses/course-detail/course-detail.component";
import {PlayerComponent} from "./player/player.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'courses', component: CoursesComponent, children: [
      { path: ':id', component: CourseListComponent },
    ]},
  // { path: 'course/:id', component: CourseDetailComponent }
  { path: 'course/:id', component: PlayerComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
