import {Injectable} from "@angular/core";
import {Review} from "../models/Review";
import {Dish} from "../models/Dish";
import {OrderDetailsService} from "./OrderDetailsService";
import {DishModel} from "../models/dish.model";
import {map} from "rxjs";
import {User} from "../models/user.model";
import {AuthenticationService} from "./authentication.service";
import {getAuth} from "@angular/fire/auth";

@Injectable()
export class ReviewsService{

  reviews: Review[] = [];
  spectatedDish: Dish;

  //currentUserReviewStat: boolean = false; //reviewing one dish blocks all further reviews -> and this shouldn't happen

  dishesFirebase? : DishModel[];
  usersFirebase?: User[];

  constructor(private orderDetailsServ : OrderDetailsService, private authServ: AuthenticationService) {
    this.getDishes();
    this.getUsers();

  }

  adNewReview(form: Review, dish: Dish){
    const newReview: Review = {nickname:form.nickname,reviewName: form.reviewName,reviewText:form.reviewText,dateOfOrder:form.dateOfOrder,dishName:this.spectatedDish.name};
    this.reviews.push(newReview);

    //test
    dish.reviews.push(newReview);
    for (let dishDB of this.dishesFirebase){
      if (dishDB.name === dish.name){
        this.orderDetailsServ.editDish(dishDB!.id!,dish).catch(err => console.log(err));
        break;
      }
    }
    //controlling numbers of review
    const auth = getAuth();
    const currentUser = auth.currentUser;
    for (let userDB of this.usersFirebase){
      if (userDB.uid === currentUser.uid){
        for (let order of userDB.orders){
          if (order.name === this.spectatedDish.name){
            order.ifReviewed = true;
            console.log(userDB!.id!, userDB);
            this.authServ.editUser(userDB!.id!, userDB).catch(err => console.log(err));
          }
        }
        break;
      }
    }

    for (let userLoc of this.authServ.users){
      if (userLoc.uid === currentUser.uid){
        for (let order of userLoc.orders){
          if (order.name === this.spectatedDish.name){
            order.ifReviewed = true;
          }
        }
        break;
      }
    }

    //this.getUserReviewStat();
   // console.log(this.currentUserReviewStat);



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

  // getUserReviewStat(){
  //   const auth = getAuth();
  //   const authUser = auth.currentUser;
  //   for (let user of this.authServ.users){
  //     if (user.uid === authUser.uid){
  //       for (let order of user.orders){
  //         if (order.name === this.spectatedDish.name){
  //           this.currentUserReviewStat = order.ifReviewed;
  //           break;
  //         }
  //       }
  //       break;
  //     }
  //   }
  // }


}
