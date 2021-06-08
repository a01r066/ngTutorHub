import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AdCategoriesComponent} from "./ad-categories/ad-categories.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AdminComponent} from "./admin.component";

const routes: Routes = [
  { path: 'admin', component: AdminComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: AdCategoriesComponent }
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
