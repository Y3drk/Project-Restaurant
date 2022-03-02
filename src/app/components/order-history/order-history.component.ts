import { Component, OnInit, AfterViewInit } from '@angular/core';
import {map} from "rxjs";
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../models/user.model";
import {getAuth} from "@angular/fire/auth";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit, AfterViewInit {

  orderedDishes: {name: string, amount: number, ifRated: boolean, ifReviewed: boolean}[] = [];
  usersFirebase?: User[];

  constructor(private authServ: AuthenticationService) { }

  ngOnInit(): void {
    this.getUsers();
    this.prepareHistory();
  }

  ngAfterViewInit() {
    this.getUsers();
    this.prepareHistory();
  }

  getUsers(): void {
    this.authServ.getUserList().snapshotChanges()
      .pipe(map(changes => changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() }))
      )).subscribe(data => {this.usersFirebase = data});
  }

  prepareHistory(){
    const auth = getAuth();
    const currentUser = auth.currentUser;

    for (let userDB of this.usersFirebase){
      if (userDB.uid === currentUser.uid){
        for (let order of userDB.orders){
          this.orderedDishes.push(order);
        }
      }
    }
  }
}
