
import {Dish} from "../models/Dish";
import {Injectable} from "@angular/core";
import { Subject} from "rxjs";

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {DishModel} from "../models/dish.model";


@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {
  chosenCurrency = "USD";
  chosenAmount = 0;
  totalCost = 0;

  chosenDishes: { id: string, name: string, amount: number, priceUSD: number, priceEUR: number }[] = [];

  amounts: {id: string, name:string, amount:number}[] = [];
  originalAmounts: {name:string, ogAmount:number}[] = [];
  avgRatings: {name:string, avgRating: number, timesRated: number, toRate:boolean}[] = []

  private dbPath = '/dishes';
  dishesRef: AngularFirestoreCollection<DishModel>;
  dbDishes: DishModel[];

  dishes: Dish[] = [];

  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor(private db:AngularFirestore) {
    this.dishesRef = db.collection(this.dbPath);


    this.dishesRef.ref.get().then((querySnapshot) => {
      this.dbDishes = querySnapshot.docs.map(doc => doc.data());


    for (let dish of this.dbDishes){

      // this.editDish(dish!.id!,{
      //   iden: dish.iden,
      //   name: dish.name,
      //   cuisineType: dish.cuisineType,
      //   dishCategory: dish.dishCategory,
      //   ingredients: dish.ingredients,
      //   maxAmountOfDishes: dish.maxAmountOfDishes,
      //   priceUSD: dish.priceUSD,
      //   priceEUR: dish.priceEUR,
      //   dishDescription: dish.dishDescription,
      //   mainPhotoLink: dish.mainPhotoLink,
      //   secondPhotoLink: dish.secondPhotoLink,
      //   thirdPhotoLink: dish.thirdPhotoLink,
      //   ratings: {avgRating: 0, timesRated: 0, toRate: false} //ratings test
      // } )

      this.chosenDishes.push({
        id: dish.iden,
        name: dish.name,
        amount: 0,
        priceUSD: dish.priceUSD,
        priceEUR: dish.priceEUR
      });

      this.dishes.push({
        iden: dish.iden,
        name: dish.name,
        cuisineType: dish.cuisineType,
        dishCategory: dish.dishCategory,
        ingredients: dish.ingredients,
        maxAmountOfDishes: dish.maxAmountOfDishes,
        priceUSD: dish.priceUSD,
        priceEUR: dish.priceEUR,
        dishDescription: dish.dishDescription,
        mainPhotoLink: dish.mainPhotoLink,
        secondPhotoLink: dish.secondPhotoLink,
        thirdPhotoLink: dish.thirdPhotoLink,
        ratings: dish.ratings,
        reviews: dish.reviews //reviews test
      });

      this.amounts.push({id: dish.iden, name: dish.name, amount: dish.maxAmountOfDishes});
      this.originalAmounts.push({name: dish.name, ogAmount: dish.maxAmountOfDishes});
      //this.avgRatings.push({name:dish.name, avgRating: 0, timesRated: 0, toRate:false});
    }
    });
    // console.log(this.amounts);
    // console.log(this.chosenDishes);
    // console.log(this.originalAmounts);
    // console.log(this.avgRatings);
    console.log(this.dishes);
  }

  reduceStockAddtoChosen(event : Event){
    for (let i=0; i< this.amounts.length; i++){
      if (this.amounts[i].name === (<HTMLInputElement>event.target).id && this.amounts[i].amount - 1 >= 0){
        this.incrementAmount(this.amounts[i].name);
        this.amounts[i].amount--;
      }
    }
  }

  increaseStockDeletefromChosen(event : Event){
    for (let i=0; i< this.amounts.length; i++){
      if (this.amounts[i].id === (<HTMLInputElement>event.target).id && this.amounts[i].amount + 1 <= this.originalAmounts[i].ogAmount){
        this.decrementAmount(this.amounts[i].name);
        this.amounts[i].amount++;
      }
    }
  }

  getAmount() {
    return this.chosenAmount;
  }

  CountTotalCost() {
    let sum = 0;
    for (let dish of this.chosenDishes) {
      if (this.chosenCurrency === "USD") {
        sum += dish.priceUSD * dish.amount;
      } else {
        sum += dish.priceEUR * dish.amount;
      }
    }
    this.totalCost = sum;
  }

  getChosenCurrency() {
    return this.chosenCurrency;
  }

  zeroAmount(dishName:string){
    for (let dish of this.chosenDishes) {
      if (dish.name === dishName) {
        this.chosenAmount -= dish.amount;
        dish.amount = 0;
        break;
      }
    }
  }

  incrementAmount(dishName: string) {
    this.chosenAmount++;
    for (let dish of this.chosenDishes) {
      if (dish.name === dishName) {
        dish.amount++;
        break;
      }
    }
  }

  decrementAmount(dishName: string) {
    this.chosenAmount--;
    for (let dish of this.chosenDishes) {
      if (dish.name === dishName) {
        dish.amount--;
        break;
      }
    }
  }

  returnTheMostExpensive() {
    let theMostExpensive: string;
    let biggestPrice = 0;
    for (let dish of this.dishes) {
      if (this.chosenCurrency === 'USD') {
        if (dish.priceUSD > biggestPrice) {
          biggestPrice = dish.priceUSD;
          theMostExpensive = dish.name;
        }
      } else {
        if (dish.priceEUR > biggestPrice) {
          biggestPrice = dish.priceEUR;
          theMostExpensive = dish.name;
        }
      }
    }
    return theMostExpensive;
  }

  returnTheCheapest() {
    let theCheapest: string;
    let smallestPrice = 100000;
    for (let dish of this.dishes) {
      if (this.chosenCurrency === 'USD') {
        if (dish.priceUSD < smallestPrice) {
          smallestPrice = dish.priceUSD;
          theCheapest = dish.name;
        }
      } else {
        if (dish.priceEUR < smallestPrice) {
          smallestPrice = dish.priceEUR;
          theCheapest = dish.name;
        }
      }
    }
    return theCheapest;
  }

  addNewDish(dish: Dish){
    this.chosenDishes.push({
      id: dish.iden,
      name: dish.name,
      amount: 0,
      priceUSD: dish.priceUSD,
      priceEUR: dish.priceEUR
    });
    this.dishes.push(dish);
    this.amounts.push({id: dish.iden, name:dish.name, amount: dish.maxAmountOfDishes});
    this.originalAmounts.push({name: dish.name, ogAmount:dish.maxAmountOfDishes});
    //this.avgRatings.push({name: dish.name, avgRating:0, timesRated: 0, toRate:false})
    console.log(this.dishes);
    this.callComponentMethodAdd(dish);
  }

  deleteTheDish(dish: Dish){
    this.dishes = this.dishes.filter(function (x){
      return x != dish;
    })
  }

  callComponentMethodAdd(dish: Dish){
    this.componentMethodCallSource.next(dish);
  }

  getDishList(): AngularFirestoreCollection<DishModel>{
    return this.dishesRef;
  }

  createDish(dish: DishModel):any{
    return this.dishesRef.add({...dish});
  }

  deleteDish(id: string): Promise <void>{
    return this.dishesRef.doc(id).delete();
  }

  editDish(id:string, value: any): Promise<void>{
    //console.log(value);
    return this.dishesRef.doc(id).update(value);
  }
}
