import { Component, OnInit } from '@angular/core';
import {Dish} from "../../models/Dish";
import {OrderDetailsService} from "../../services/OrderDetailsService"
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {ReviewsService} from "../../services/ReviewsService";
import {AuthenticationService} from "../../services/authentication.service";
import {getAuth} from "@angular/fire/auth";
import {DishModel} from "../../models/dish.model";
import {map} from "rxjs";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-detailed-look',
  templateUrl: './detailed-look.component.html',
  styleUrls: ['./detailed-look.component.css']
})
export class DetailedLookComponent implements OnInit {
  dishesFirebase? : DishModel[];
  usersFirebase?: User[];

  ratingHidden = false;

  dishes = this.orderDetails.dishes;
  amounts = this.orderDetails.amounts;
  originalAmounts = this.orderDetails.originalAmounts;

  spectatedDish: Dish;
  spectatedDishInd: number;

  reviews = this.reviewsService.reviews;

  constructor(public orderDetails: OrderDetailsService,
              public reviewsService : ReviewsService,
              private route: ActivatedRoute,
              private location: Location,
              private authServ: AuthenticationService) {
  }

  ngOnInit(): void {
    this.getDishes();
    this.getUsers();

  }

  getDish(){
    const id = String(this.route.snapshot.paramMap.get('id'));

    for (let ind = 0; ind < this.dishes.length; ind++){
      if (this.dishes[ind].iden === id) {
        this.spectatedDish = this.dishes[ind];
        this.reviewsService.spectatedDish = this.spectatedDish;
        this.spectatedDishInd = this.findTheDish(this.spectatedDish);

        return this.dishes[ind];

      }
    }
  }

  reduceStockAddtoChosen(event : Event){
    this.orderDetails.reduceStockAddtoChosen(event);
  }

  increaseStockDeletefromChosen(event : Event){
    this.orderDetails.increaseStockDeletefromChosen(event);
  }

  getCurrency(){
    return this.orderDetails.getChosenCurrency();
  }

  getTheMostExpensive(){
    return this.orderDetails.returnTheMostExpensive();
  }

  getTheCheapest(){
    return this.orderDetails.returnTheCheapest();
  }


  onMoveToRatingTEST(event: Event){
    for (let dish of this.dishes){
      if (dish.name === (<HTMLInputElement>event.target).name){
        dish.ratings.toRate = !dish.ratings.toRate;
      }
    }
  }

  onHoverChange(num: number, inOrout: boolean, event: Event){
    let name = (<HTMLInputElement>event.target).name;
    for (let i = 1; i <= num; i++) {
      let button = document.getElementById(name+"star" + i);
      if (inOrout) {
        button.style.backgroundImage = 'url("../../assets/nowe-logo-nba-75.png")';
      } else {
        button.style.backgroundImage = 'url("../../assets/nowe-logo-nba-75-greyscale.png")';
      }
    }
  }

  onRatingTEST(event: Event, rate: number){
    for (let dish of this.dishesFirebase){
      if (dish.name === (<HTMLInputElement>event.target).name){
        dish.ratings.avgRating = (dish.ratings.avgRating*dish.ratings.timesRated + rate) / (dish.ratings.timesRated + 1);
        dish.ratings.timesRated++;

        this.spectatedDish.ratings.avgRating = (dish.ratings.avgRating*dish.ratings.timesRated + rate) / (dish.ratings.timesRated + 1);
        this.spectatedDish.ratings.timesRated++;

        this.orderDetails.editDish(dish!.id!, dish).catch(err => console.log(err));
        this.displayAvgRatingTEST(dish.name);

        const auth = getAuth();
        const currentUser = auth.currentUser;
        for (let userDB of this.usersFirebase){
          if (userDB.uid === currentUser.uid){
            for (let order of userDB.orders){
              if (order.name === this.spectatedDish.name){
                order.ifRated = true;
                console.log(userDB!.id!, userDB);
                this.authServ.editUser(userDB!.id!, userDB).catch(err => console.log(err));
                this.ratingHidden = true;
              }
            }
            break;
          }
        }
      }
    }
  }


  displayAvgRatingTEST(name:string){
    for (let dish of this.dishes){
      if (name === dish.name) {
        for (let i = 1; i <= 6; i++) {
          let span = document.getElementById(name + "avgStar" + i);
          //console.log(span);
          if (i <= Math.floor(dish.ratings.avgRating)) {
            span.style.backgroundImage = 'url("../../../assets/nowe-logo-nba-75.png")';
          } else span.style.backgroundImage = 'url("../../../assets/nowe-logo-nba-75-greyscale.png")';
        }
      }
    }
  }

  checkForReviewsTEST(name: string){
    for (let dish of this.dishes){
      if (dish.name === name && dish.reviews.length > 0){
        return true;
      }
    }
    return false;
  }

  findTheDish(dish : Dish){
    for (let d = 0; d < this.amounts.length; d ++){
      if (this.amounts[d].name === dish.name){
        return d;
      }
    }
  }

  canRate(){
    const auth = getAuth();
    const user = auth.currentUser;
    for (let userDB of this.authServ.users) {
      if (userDB.uid === user.uid) {
        let ifBanned = userDB.banned;
        let ifRated: boolean = true; //rating blocked after one rating , assigning true at first guarantees that if the user didn't order the dish he won't be able to rate it
        for (let order of userDB.orders){
          if (order.name === this.spectatedDish.name){
            ifRated = order.ifRated;
          }
        }
        return (ifBanned || this.authServ.getHighestRole() === 'manager' || ifRated);
      }
    }
  }

  canReview(){
    const auth = getAuth();
    const user = auth.currentUser;
    for (let userDB of this.authServ.users) {
      if (userDB.uid === user.uid) {
        let ifReviewed: boolean = true;
        if ((this.authServ.getHighestRole() === 'manager' || this.authServ.getHighestRole() === 'manager')  && !userDB.banned){
          return false;
        }
        for (let order of userDB.orders) {
          if (order.name === this.spectatedDish.name) {
            ifReviewed = order.ifReviewed;
          }
        }
        return userDB.banned || ifReviewed;
      }
    }
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

  ifStarEarned(starNo: number, name: string){
    for (let dish of this.dishes){
      if (name === dish.name) {
          return starNo <= Math.floor(dish.ratings.avgRating);
        }
    }
  }
}
