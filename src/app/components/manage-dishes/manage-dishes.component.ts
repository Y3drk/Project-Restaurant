import { Component, OnInit, AfterViewInit } from '@angular/core';
import {OrderDetailsService} from "../../services/OrderDetailsService";
import {AuthenticationService} from "../../services/authentication.service";
import {Dish} from "../../models/Dish";
import {DishModel} from "../../models/dish.model";
import {map} from "rxjs";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-manage-dishes',
  templateUrl: './manage-dishes.component.html',
  styleUrls: ['./manage-dishes.component.css']
})
export class ManageDishesComponent implements OnInit , AfterViewInit{
  dishes = this.orderDetailsServ.dishes;

  dishesFirebase? : DishModel[];
  usersFirebase?: User[];

  amounts = this.orderDetailsServ.amounts;
  avgRatings = this.orderDetailsServ.avgRatings;
  originalAmounts = this.orderDetailsServ.originalAmounts;

  constructor(private orderDetailsServ: OrderDetailsService, private authServ: AuthenticationService) {
  }

  ngOnInit(): void {
    this.getDishes();
    this.getUsers();
  }

  ngAfterViewInit() {
    this.getDishes();
    this.getUsers();
  }

  getDishInd(name : string){
    for (let i = 0; i < this.amounts.length; i++){
      if (this.amounts[i].name === name){
        return i;
      }
    }
  }

  getDishes(): void {
    this.orderDetailsServ.getDishList().snapshotChanges()
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

  deleteTheDish(event: Event){
    let deletedDish: Dish;
    for (let dish of this.dishes){
      if (dish.name === (<HTMLInputElement>event.target).name){
        deletedDish = dish;
        break;
      }
    }
    let deletedDishFb: DishModel;
    for (let dish of this.dishesFirebase){
      if (dish.name === (<HTMLInputElement>event.target).name){
        deletedDishFb = dish;
        break;
      }
    }

    for (let i=0; i< this.amounts.length; i++) {
      if (this.amounts[i].name === (<HTMLInputElement>event.target).name) {
        this.orderDetailsServ.zeroAmount(this.amounts[i].name);
      }
    }
    this.amounts = this.amounts.filter(function(x){
      return x.name != (<HTMLInputElement>event.target).name;
    });

    this.originalAmounts = this.originalAmounts.filter(function(x){
      return x.name != (<HTMLInputElement>event.target).name;
    });

    this.dishes = this.dishes.filter(function(x){
      return x.name != (<HTMLInputElement>event.target).name;
    });

    this.avgRatings = this.avgRatings.filter(function(x){
      return x.name != (<HTMLInputElement>event.target).name;
    });

    for (let userDB of this.usersFirebase){
      let newOrders: {name: string, amount: number, ifRated: boolean, ifReviewed: boolean}[] = []
      let flag = false;
      for (let order of userDB.orders){
        if (order.name != (<HTMLInputElement>event.target).name){
          newOrders.push(order);
        } else flag = true;
      }
      if (flag){
        userDB.orders = newOrders;
        this.authServ.editUser(userDB!.id!, userDB).catch(err => console.log(err));
      }
    }

    this.orderDetailsServ.deleteTheDish(deletedDish);

    this.orderDetailsServ.deleteDish(deletedDishFb!.id!).catch(err => console.log(err));
  }

}
