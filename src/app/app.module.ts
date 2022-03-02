import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DishesComponent } from './components/dishes/dishes.component';
import { NewDishFormComponent } from './components/new-dish-form/new-dish-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FiltersComponent } from './components/filters/filters.component';
import {Ng5SliderModule} from "ng5-slider";
import {filtersPipe} from "./others/filters.pipe";
import { BasketComponent } from './components/basket/basket.component';
import {RouterModule, Routes} from "@angular/router";
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { MapComponent } from './components/map/map.component';
import { MarkerService } from './services/marker.service';
import { NewReviewComponent } from './components/new-review/new-review.component';
import { DetailedLookComponent } from './components/detailed-look/detailed-look.component';
import { PaginationDirective } from './others/pagination.directive';
import { PaginationComComponent } from './components/pagination-com/pagination-com.component';

import { AngularFireModule } from '@angular/fire/compat'
import { AngularFirestoreModule} from '@angular/fire/compat/firestore'
import { environment } from '../environments/environment';
import { EditDishComponent } from './components/edit-dish/edit-dish.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {AuthenticationService} from "./services/authentication.service";
import { ManageDishesComponent } from './components/manage-dishes/manage-dishes.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import {UnLoggedGuardGuard} from "./others/un-logged-guard.guard";
import {ManagementGuard} from "./others/management.guard";
import {AdministrationGuard} from "./others/administration.guard";

const routes: Routes = [
  {path: 'home', component:HomeComponent},
  {path:'dishList', component:DishListComponent},
  {path:'newDishForm',component:NewDishFormComponent},
  {path:'basket',component: BasketComponent},
  {path:'editDish/:id', component: EditDishComponent},
  {path: 'detailedLook/:id', component: DetailedLookComponent, canActivate:[UnLoggedGuardGuard]},
  {path: 'logIn', component: LogInComponent},
  {path: 'signUp', component:SignUpComponent},
  {path:'manageDishes', component: ManageDishesComponent, canActivate:[ManagementGuard]},
  {path: 'adminView', component: AdminViewComponent, canActivate: [AdministrationGuard]},
  {path: 'editUser/:id', component: EditUserComponent},
  {path: 'orderHist', component:OrderHistoryComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DishesComponent,
    NewDishFormComponent,
    FiltersComponent,
    filtersPipe,
    BasketComponent,
    HomeComponent,
    PageNotFoundComponent,
    DishListComponent,
    MapComponent,
    NewReviewComponent,
    DetailedLookComponent,
    PaginationDirective,
    PaginationComComponent,
    EditDishComponent,
    LogInComponent,
    SignUpComponent,
    ManageDishesComponent,
    AdminViewComponent,
    EditUserComponent,
    OrderHistoryComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    RouterModule.forRoot(routes),
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule
  ],
  providers: [MarkerService],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
