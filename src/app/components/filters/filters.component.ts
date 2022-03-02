import { Component, OnInit } from '@angular/core';
import {OrderDetailsService} from "../../services/OrderDetailsService";
import {Dish} from "../../models/Dish";
import {FiltersService} from "../../services/FiltersService";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  dishes =  this.orderDetails.dishes;
  dishCategory: string[] = [];
  cuisineType: string[] = [];
  ratings: string[] = ['rate0','rate1','rate2','rate3','rate4','rate5','rate6'];

  ifShow: boolean[] = [false, false, false, false, false];
  ifChosenType: {name:string, ifChosen: boolean}[] = [];
  ifChosenCategory: {name:string, ifChosen: boolean}[] = [];
  ifChosenRating: {name:string, ifChosen: boolean}[] = [{name:'rate0', ifChosen:false},{name:'rate1', ifChosen:false},{name:'rate2', ifChosen:false},{name:'rate3', ifChosen:false},{name:'rate4', ifChosen:false},{name:'rate5', ifChosen:false},{name:'rate6', ifChosen:false}];


  constructor(private orderDetails: OrderDetailsService, public filters : FiltersService) {
    this.orderDetails.componentMethodCalled$.subscribe((dish : Dish)=>{this.addTheDish(dish)});

  }

  ngOnInit(): void {
    for (let dish of this.dishes){
      if (!this.checkIfIn(dish.cuisineType,this.cuisineType)){
        this.cuisineType.push(dish.cuisineType);
        this.ifChosenType.push({name:dish.cuisineType, ifChosen:false})
      }
      if (!this.checkIfIn(dish.dishCategory,this.dishCategory)){
        this.dishCategory.push(dish.dishCategory);
        this.ifChosenCategory.push({name:dish.dishCategory, ifChosen:false})
      }
    }
  }

  getCurrency(){
    return this.orderDetails.getChosenCurrency();
  }

  checkIfIn(value : any, array: any[]){
    for (let field of array){
      if (value === field) return true;
    }
    return false;
  }

  checkIfInChosen(value : any, array: {name:string, ifChosen: boolean}[]){
    for (let field of array){
      if (value === field.name) return true;
    }
    return false;
  }

  showFilters(ind: number, array: any[], type: string){
    this.dishes = this.orderDetails.dishes;
    if (array != null && type != null) array = this.reevaluate(array, type);
    for (let arr of [this.cuisineType, this.dishCategory]){
      if (type === 'cuisineType'){
        this.cuisineType = array;
      } else if (type === 'dishCategory'){
        this.dishCategory = array;
      }
    }
    this.ifShow[ind] = !this.ifShow[ind];

  }

  reevaluate(array: any[], type: string,){
    let toRemove: any[] = []
    for (let field of array){
      let ifExists = false;
      for (let dish of this.dishes){
        if (field === dish[type]){
          ifExists = true;
          break;
        }
      }
      if (!ifExists){
        toRemove.push(field);
      }
    }
    for (let field of toRemove){
      array = array.filter(function (x){
        return field != x;
      })
    }
    return array;
  }

  getMin(array: number[]){
    let min :number = array[0];
    for (let elem of array){
      if (elem < min){
        min = elem;
      }
    }
    return min;
  }

  getMax(array: number[]){
    let max :number = array[0];
    for (let elem of array){
      if (elem > max){
        max = elem;
      }
    }
    return max;
  }

  addTheDish(dish : Dish){
    if (!this.checkIfIn(dish.cuisineType,this.cuisineType)){
      this.cuisineType.push(dish.cuisineType);
      if (!this.checkIfInChosen(dish.cuisineType, this.ifChosenType)) this.ifChosenType.push({name:dish.cuisineType, ifChosen:false})
    }
    if (!this.checkIfIn(dish.dishCategory,this.dishCategory)){
      this.dishCategory.push(dish.dishCategory);
      if (!this.checkIfInChosen(dish.dishCategory, this.ifChosenCategory)) this.ifChosenCategory.push({name:dish.dishCategory, ifChosen:false})
    }
    this.dishes.push(dish);
  }

  onClickFilter(event: Event, chosenArray: {name: string, ifChosen: boolean}[] ){
    let which: string = 'rating';
    if (chosenArray === this.ifChosenCategory) which = 'category';
    else if (chosenArray === this.ifChosenType) which = 'type';
    for (let elem of chosenArray){
      if ((<HTMLInputElement>event.target).id === elem.name){
        if (elem.ifChosen){
          this.filters.deleteValue((<HTMLInputElement>event.target).id,which);
          elem.ifChosen = false;
        } else {
          this.filters.addValue((<HTMLInputElement>event.target).id, which);
          elem.ifChosen = true;
        }
      }
    }
  }

  ifChosen(name: string, chosenArray: {name: string, ifChosen: boolean}[] ){
    for (let elem of chosenArray){
      if (name === elem.name){
        if (elem.ifChosen){
          return true;
        } else {
          return false;
        }
      }
    }
  }
}


