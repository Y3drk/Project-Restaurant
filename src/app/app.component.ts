import {Component} from '@angular/core';
import {OrderDetailsService} from "./services/OrderDetailsService";
import {FiltersService} from "./services/FiltersService";
import {filtersPipe} from "./others/filters.pipe";
import {ReviewsService} from "./services/ReviewsService";
import {PaginationService} from "./services/PaginationService";
import {PaginationDirective} from "./others/pagination.directive";
import {AuthenticationService} from "./services/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [OrderDetailsService, FiltersService, filtersPipe, ReviewsService, PaginationService, PaginationDirective]
})
export class AppComponent{
  title = 'Project-Restaurant';

  showFilters = false;
  showBasket = false;


  constructor(private orderDetails: OrderDetailsService, private authServ : AuthenticationService) {
  }

  getAmount(){
    return this.orderDetails.chosenAmount;
  }

  getTotalCost(){
    this.orderDetails.CountTotalCost();
    return this.orderDetails.totalCost;
  }

  getCurrentCurrency(){
    if (this.orderDetails.chosenCurrency === 'USD'){
      return '$';
    } else return '€';
  }

  chooseCurrency(event:Event){
    this.orderDetails.chosenCurrency = (<HTMLInputElement>event.target).id;
  }

  changeFiltersDisplay(){
    this.showFilters = !this.showFilters;
  }

  changeBasketDisplay(){
    this.showBasket = !this.showBasket;
  }

  getLogInfo(){
    return this.authServ.userLoggedIn;
  }

  getLoggedNickname(){
    return this.authServ.currentLoggedNickname;
  }

  singOut(){
    this.authServ.logOut();
    this.orderDetails.chosenAmount = 0;
    alert('user signed-out!');
  }

  authorizeAdminView(){
    let highestRole = this.authServ.getHighestRole();
    if (this.authServ.userLoggedIn){
      return highestRole === 'admin';
    } else {
      return false;
    }
  }

  authorizeDishManagement(){
    let highestRole = this.authServ.getHighestRole();

    if (this.authServ.userLoggedIn){
      return highestRole === 'admin' || highestRole === 'manager';
    } else {
      return false;
    }
  }

}
