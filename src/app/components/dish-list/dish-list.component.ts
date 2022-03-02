import { Component, OnInit } from '@angular/core';
import {OrderDetailsService} from "../../services/OrderDetailsService";

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css']
})
export class DishListComponent implements OnInit {

  showFilters = false;

  constructor(private orderDetails: OrderDetailsService) {
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

  ngOnInit(): void {
  }

}
