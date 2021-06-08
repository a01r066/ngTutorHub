import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { FeaturesComponent } from './home/features/features.component';
import {HttpClientModule} from "@angular/common/http";
import { CoursesComponent } from './courses/courses.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { TopCategoriesComponent } from './home/top-categories/top-categories.component';
import { PlayerComponent } from './player/player.component';
import {AuthModule} from "./auth/auth.module";
import {MaterialModule} from "./material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LearningComponent } from './home/learning/learning.component';
import {DecimalPipe} from "@angular/common";
import { OrdersComponent } from './home/orders/orders.component';
import {ShareModule} from "./share.module";
import { SearchComponent } from './search/search.component';
import {SlugifyPipe} from "./helpers/slugify.pipe";
import {AngularFireModule} from "@angular/fire";
import {environment} from "../environments/environment";
import {AngularFireAnalyticsModule} from "@angular/fire/analytics";
import { ProfileComponent } from './home/profile/profile.component';
import {StoreModule} from "@ngrx/store";
import { appReducer} from "./app.reducer";
import { LoadingComponent } from './shares/loading/loading.component';
import {FeedbackComponent} from "./home/Feedback/feedback.component";
import { MessageComponent } from './shares/message/message.component';
import {LoadingService} from "./services/loading.service";
import {MessagesService} from "./services/messages.service";
import { AdminComponent } from './admin/admin.component';
import {AdminModule} from "./admin/admin.module";

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
    OrdersComponent,
    SearchComponent,
    SlugifyPipe,
    ProfileComponent,
    LoadingComponent,
    FeedbackComponent,
    MessageComponent,
    AdminComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    ShareModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    MaterialModule,
    FlexLayoutModule,
    StoreModule.forRoot({ui: appReducer}), // allow map multiple reducer with key
    AdminModule
  ],
  providers: [
    DecimalPipe,
    LoadingService,
    MessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
