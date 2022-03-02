import { Component, OnInit } from '@angular/core';
import {OrderDetailsService} from "../../services/OrderDetailsService";
import {AuthenticationService} from "../../services/authentication.service";
import {getAuth} from "@angular/fire/auth";
import {DishModel} from "../../models/dish.model";
import {map} from "rxjs";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  showBasket = false;

  dishesFirebase?: DishModel[];
  usersFirebase?: User[];

  constructor(private orderDetails: OrderDetailsService, private authServ: AuthenticationService) {
  }

  ngOnInit(): void {
    this.getDishes();
    this.getUsers();
  }

  getChosenDishes(){
    return this.orderDetails.chosenDishes;
  }

  getCurrentCurrency(){
    if (this.orderDetails.chosenCurrency === 'USD') return '$';
    else return '€';
  }

  getTotalCost(name: string){
    for (let dish of this.orderDetails.chosenDishes){
      if (dish.name === name){
        if (this.orderDetails.chosenCurrency === 'USD'){
          return dish.amount*dish.priceUSD;
        } else return dish.amount*dish.priceEUR;
      }
    }
  }

  getWholeOrderCost(){
    let cost = 0;
    for (let dish of this.orderDetails.chosenDishes){
      if (this.orderDetails.chosenCurrency === 'USD'){
        cost += dish.amount*dish.priceUSD;
      } else cost += dish.amount*dish.priceEUR;
    }
    return cost;
    }

  changeBasketDisplay(){
    this.showBasket = !this.showBasket;
  }

  getLogInfo(){
    return this.authServ.userLoggedIn;
  }

  onBuy(){
    const auth = getAuth();
    let currentUser = auth.currentUser;
    this.orderDetails.chosenAmount = 0;

    for (let user of this.usersFirebase){
      if (user.uid === currentUser.uid){
          for (let cd of this.orderDetails.chosenDishes){
              let flag = false;
              for (let order of user.orders){
                if (order.name === cd.name){
                  flag = true;
                  order.amount += cd.amount;
                }
          }
              if (!flag && cd.amount > 0){
                user.orders.push({name: cd.name, amount: cd.amount, ifRated: false, ifReviewed: false});
              }

              //here should be updating the amount of dishes inside the database
              for (let dbDish of this.dishesFirebase){
                if (cd.name === dbDish.name){
                  dbDish.maxAmountOfDishes -= cd.amount;
                  this.orderDetails.editDish(dbDish!.id!, dbDish).catch((err) => {console.log(err)});
                }
              }
            //and locally
            for (let ogAmDish of this.orderDetails.originalAmounts){
              if (cd.name === ogAmDish.name){
                ogAmDish.ogAmount -= cd.amount;
                for (let amDish of this.orderDetails.amounts){
                  if (cd.name === amDish.name){
                    amDish.amount= ogAmDish.ogAmount;
                  }
                }
              }
            }
              cd.amount = 0; //resetting choosen dishes after buying
        }
          this.authServ.editUser(user!.id!, user).catch((err) => {console.log(err)}); //updating users orders in db

          for (let userLoc of this.authServ.users){ //updating users orders locally
            if (currentUser.uid === userLoc.uid){
              userLoc.orders = user.orders;
            }
          }
          break;
      }
    }
  }

  isBasketEmpty(){
    for (let dish of this.orderDetails.chosenDishes){
      if (dish.amount > 0){
        return false;
      }
    }
    return true;
  }

  getDishes(): void {
    this.orderDetails.getDishList().snapshotChanges()
      .pipe(map(changes => changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() }))
      )).subscribe(data => {this.dishesFirebase = data});
  }

  getUsers(): void {
    this.authServ.getUserList().snapshotChanges()
      .pipe(map(changes => changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() }))
      )).subscribe(data => {this.usersFirebase = data});
  }
}
