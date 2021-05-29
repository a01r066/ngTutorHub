import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { FeaturesComponent } from './home/features/features.component';
import {CarouselModule} from "primeng/carousel";
import {HttpClientModule} from "@angular/common/http";
import {ButtonModule} from "primeng/button";
import { CoursesComponent } from './courses/courses.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { TopCategoriesComponent } from './home/top-categories/top-categories.component';
import { PlayerComponent } from './player/player.component';
import {AuthModule} from "./auth/auth.module";
import {SharedModule} from "primeng/api";
import {MaterialModule} from "./material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LearningComponent } from './home/learning/learning.component';
import {DecimalPipe} from "@angular/common";
import { OrdersComponent } from './home/orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HomeComponent,
    FeaturesComponent,
    CoursesComponent,
    CourseListComponent,
    CourseDetailComponent,
    TopCategoriesComponent,
    PlayerComponent,
    CartComponent,
    CheckoutComponent,
    LearningComponent,
    OrdersComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    ButtonModule,
    AuthModule,
    CarouselModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
