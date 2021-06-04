import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {CoursesComponent} from "./courses/courses.component";
import {CourseListComponent} from "./courses/course-list/course-list.component";
import {CourseDetailComponent} from "./courses/course-detail/course-detail.component";
import {AuthGuard} from "./auth/auth.guard";
import {CartComponent} from "./cart/cart.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {LearningComponent} from "./home/learning/learning.component";
import {SearchComponent} from "./search/search.component";
import {ProfileComponent} from "./home/profile/profile.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'courses', component: CoursesComponent, children: [
      { path: ':id', component: CourseListComponent },
    ]},
  { path: 'course/:id', component: CourseDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]},
  { path: 'home/my-courses/learning', component: LearningComponent, canActivate: [AuthGuard]},
  { path: 'search', component: SearchComponent },
  { path: 'user/profile', component: ProfileComponent, canActivate: [AuthGuard]}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {
}
