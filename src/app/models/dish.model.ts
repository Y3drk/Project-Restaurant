import {Review} from "./Review";

export class DishModel{
  id?:string;
  iden?: string;
  name?: string;
  cuisineType?: string;
  dishCategory?: string;
  ingredients?: string;
  maxAmountOfDishes?: number;
  priceUSD?: number;
  priceEUR?: number;
  dishDescription?: string;
  mainPhotoLink?: string;
  secondPhotoLink?: string;
  thirdPhotoLink?: string;
  ratings?:{avgRating: number, timesRated: number, toRate:boolean};
  reviews?: Review[];
}
