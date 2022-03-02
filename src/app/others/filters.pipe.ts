import {Pipe, PipeTransform} from "@angular/core";
import {Dish} from "../models/Dish";

@Pipe({
  name: 'filter'
})
export class filtersPipe implements PipeTransform{
    transform(value: Dish[], chosenCategories: string[], chosenTypes: string[], chosenRatings: string[],  chosenPrices: number[], whichPrice: string): any {
      if (value.length === 0 || (chosenCategories.length === 0 && chosenPrices.length == 0 && chosenTypes.length == 0 && chosenRatings.length == 0)){
        return value;
      }
      let resultArray: Dish[] = [];

      let evalPrice = true;
      if(chosenPrices[1] != 0) evalPrice = false;

      for (let item of value){
        let evalCat = true;
        if (chosenCategories.length > 0) evalCat = false;

        let evalType = true;
        if (chosenTypes.length > 0) evalType = false;

        let evalRating = true;
        if (chosenRatings.length > 0) evalRating = false;
        for (let type of chosenTypes){
          if (item.cuisineType === type){
            evalType = true;
            break;
          }
        }
        for (let cat of chosenCategories){
          if (item.dishCategory === cat){
            evalCat = true;
            break;
          }
        }
        for (let rate of chosenRatings){
          for (let dish of value){
            if (item.name === dish.name && rate === ('rate'+ Math.floor(dish.ratings.avgRating))){
              evalRating = true;
              break;
            }
          }
        }
        if (evalCat && evalType && evalRating) resultArray.push(item);
      }

      if(!evalPrice) {
        if (whichPrice === 'USD') {
          resultArray = resultArray.filter(function (x) {
            return (x.priceUSD >= chosenPrices[0] && x.priceUSD <= chosenPrices[1])
          });
        } else {
          resultArray = resultArray.filter(function (x) {
            return (x.priceEUR >= chosenPrices[0] && x.priceEUR <= chosenPrices[1])
          });
        }
      }

      return resultArray;
    }

    isIn(value: any[], array: any[]){
      for (let field of array){
        if (value === field) return true;
      }
      return false;
    }
}
