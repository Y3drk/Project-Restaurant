import {Options} from "ng5-slider";

export class FiltersService{
  chosenCurrency = 'USD';
  chosenForUSD: number[] = [0,0];
  chosenForEUR: number[] = [0,0];

  optionsUSD: Options = {
    floor: 0, //+getMinPrice('USD')
    ceil: 100,
  };

  optionsEUR: Options = {
  floor: 0,
  ceil: 100,
};

  chosenTypes: string[] = [];
  chosenCategories: string[] = [];
  chosenRatings: string[] = [];

  addValue(value: any, which: string){
    if (which === 'type'){
      this.chosenTypes.push(value);
    } else if (which === 'category'){
      this.chosenCategories.push(value);
    } else if (which === 'rating'){
      this.chosenRatings.push(value);
    }
  }

  deleteValue(value: any, which: string){
    if (which === 'type'){
      this.chosenTypes = this.chosenTypes.filter(function (x){
        return x != value;
      });
    } else if (which === 'category'){
      this.chosenCategories = this.chosenCategories.filter(function (x){
        return x != value;
      });
    } else if (which === 'rating'){
      this.chosenRatings = this.chosenRatings.filter(function (x){
        return x != value;
      });
    }
  }
}
