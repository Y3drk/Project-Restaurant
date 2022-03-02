import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Dish} from "../../models/Dish";
import {OrderDetailsService} from "../../services/OrderDetailsService"
import {FiltersService} from "../../services/FiltersService";
import {filtersPipe} from "../../others/filters.pipe";
import {PaginationService} from "../../services/PaginationService";
import {PaginationDirective} from "../../others/pagination.directive";
import {DishModel} from "../../models/dish.model";
import {map} from "rxjs";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit, AfterViewInit {
  dishes = this.orderDetails.dishes;

  dishesFirebase? : DishModel[];

  amounts = this.orderDetails.amounts;
  originalAmounts = this.orderDetails.originalAmounts;

  constructor(public orderDetails: OrderDetailsService,
              private filters : FiltersService,
              private filterPipe: filtersPipe,
              private pagServ: PaginationService,
              private pagDir: PaginationDirective,
              private authServ: AuthenticationService
              ) {}

  ngOnInit(): void {
    this.getDishes();
  }

  ngAfterViewInit() {
    for (let dish of this.dishes) {
       this.displayAvgRatingTEST(dish.name);
    }
    this.getDishes();
  }

  reduceStockAddtoChosen(event : Event){
    this.orderDetails.reduceStockAddtoChosen(event);
  }

  increaseStockDeletefromChosen(event : Event){
    this.orderDetails.increaseStockDeletefromChosen(event);
  }

  getCurrency(){
    this.filters.chosenCurrency = this.orderDetails.getChosenCurrency();

    return this.orderDetails.getChosenCurrency();
  }

  getTheMostExpensive(){
    return this.orderDetails.returnTheMostExpensive();
  }

  getTheCheapest(){
    return this.orderDetails.returnTheCheapest();
  }

  getPriceInfo(name:string){
    if (name === this.getTheMostExpensive()){
      return '1vw solid forestgreen';
    } else if (name === this.getTheCheapest()){
      return '1vw solid red';
    } else return 'none';
  }

  displayAvgRatingTEST(name:string){
    for (let dish of this.dishes){
      if (name === dish.name) {
        for (let i = 1; i <= 6; i++) {
          let span = document.getElementById(name + "avgStar" + i);
          if (span != null) {
            if (i <= Math.floor(dish.ratings.avgRating)) {
              span.style.backgroundImage = 'url("../../assets/nowe-logo-nba-75.png")';
            } else span.style.backgroundImage = 'url("../../assets/nowe-logo-nba-75-greyscale.png")';
          }
        }
      }
    }
  }

    applyFilters(){
      if(this.filters.chosenCurrency==='USD') {
        let filteredDishes: Dish[] = this.filterPipe.transform(this.dishes, this.filters.chosenCategories, this.filters.chosenTypes, this.filters.chosenRatings, this.filters.chosenForUSD, 'USD');
        this.pagServ.adaptTotalPages(filteredDishes.length);

        for (let dish of this.dishes) {
         this.displayAvgRatingTEST(dish.name);
        }

        if (this.pagServ.pageNo > this.pagServ.totalPages) {
          this.pagServ.pageNo = 1;
          this.pagDir.pageNo = 1;
        }

        filteredDishes = filteredDishes.slice(this.pagServ.elementsOnPage*(this.pagServ.pageNo -1),this.pagServ.elementsOnPage*(this.pagServ.pageNo -1)+ this.pagServ.elementsOnPage);
        return filteredDishes;
      }else {
        let filteredDishes: Dish[] = this.filterPipe.transform(this.dishes, this.filters.chosenCategories, this.filters.chosenTypes, this.filters.chosenRatings,this.filters.chosenForEUR, 'EUR');
        this.pagServ.adaptTotalPages(filteredDishes.length);

        for (let dish of this.dishes) {
          this.displayAvgRatingTEST(dish.name);
        }

        if (this.pagServ.pageNo > this.pagServ.totalPages) {
          this.pagServ.pageNo = 1;
          this.pagDir.pageNo = 1;
        }

        filteredDishes = filteredDishes.slice(this.pagServ.elementsOnPage*(this.pagServ.pageNo -1),this.pagServ.elementsOnPage*(this.pagServ.pageNo -1)+ this.pagServ.elementsOnPage);
        return filteredDishes;
      }
  }

  getDishes(): void {
    this.orderDetails.getDishList().snapshotChanges()
      .pipe(map(changes => changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() }))
    )).subscribe(data => {this.dishesFirebase = data});
  }

  getDishInd(name : string){
    for (let i = 0; i < this.amounts.length; i++){
      if (this.amounts[i].name === name){
        return i;
      }
    }
  }

  getLogInfo(){
    return this.authServ.userLoggedIn;
  }
}

