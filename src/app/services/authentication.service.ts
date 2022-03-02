import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  createUserWithEmailAndPassword,
  getAuth, setPersistence, browserSessionPersistence, browserLocalPersistence, inMemoryPersistence, GoogleAuthProvider, signInWithRedirect,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "@angular/fire/auth";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../models/user.model";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {get} from "@angular/fire/database";
import firebase from "firebase/compat";
import Persistence = firebase.auth.Auth.Persistence;
import {Observable} from "rxjs";
import {PersistenceToken} from "../models/PersistenceToken";



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userLoggedIn = false;
  currentLoggedNickname : string;

  persDB: PersistenceToken[];
  currentPersistenceStatus: string;

  private dbPath = '/users';
  usersRef: AngularFirestoreCollection<User>;
  dbUsers: User[];
  users: User[] = [];

  private dbPersPath ='/persistenceInfo';
  persistenceRef: AngularFirestoreCollection<PersistenceToken>;


  constructor(/*private http: HttpClient,*/
              private angFireAuth: AngularFireAuth,
              private db:AngularFirestore
              )
  {
    //test
    this.checkUserLogIn();

    this.persistenceRef = db.collection(this.dbPersPath);
    this.persistenceRef.ref.get().then((querySnapshot) => {
      this.persDB = querySnapshot.docs.map(doc => doc.data());

      for (let sth of this.persDB){
        console.log(sth);
        this.currentPersistenceStatus = sth.currentPersistence;
      }
    });
    //this.currentPersistenceStatus = this.persDB[0];
    console.log(this.currentPersistenceStatus);
    //test


    this.usersRef = db.collection(this.dbPath);

    this.usersRef.ref.get().then((querySnapshot) => {
      this.dbUsers = querySnapshot.docs.map(doc => doc.data());

      for (let user of this.dbUsers){
        this.users.push({
          uid: user.uid,
          nickname: user.nickname,
          banned: user.banned,
          roles: user.roles,
          orders: user.orders,
        });
      }
    });
    console.log(this.users);
  }

  signUp(email: string, password: string, nickname : string){

    const auth = getAuth();
    createUserWithEmailAndPassword(auth,email, password).
      then((userCredential) => {
        const user = userCredential.user;

      //console.log(auth.currentUser);
      this.createUser(nickname);

      updateProfile(auth.currentUser, {displayName: nickname})
        .then(() => {
        }).catch((error) =>{
        alert('an error occured during setting nickname' + error);
      });

        this.currentLoggedNickname = nickname;
      this.userLoggedIn = auth.currentUser != null;

    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage);
      })

    console.log(this.users);
  }

  logIn(email: string, password: string){
    const auth = getAuth();
    signInWithEmailAndPassword(auth,email,password)
      .then((userCredential) => {
        const user = userCredential.user;


        this.currentLoggedNickname = auth.currentUser.displayName;
        this.userLoggedIn = auth.currentUser != null;

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage);
      });


    //this.userLoggedIn = this.angFireAuth.authState;
    //this.userLoggedIn = true;
    //console.log('user log status changed to:', this.userLoggedIn);
  }

  logOut(){
    const auth = getAuth();
    signOut(auth).then(() => {
      //console.log(auth.currentUser);
      this.userLoggedIn = auth.currentUser != null;
    }).catch((error) =>{
      const errorMessage = error.message;
      alert('Unable to log-out, an error has occurred: '+ errorMessage);
    });

    //this.userLoggedIn = false;

    //this.userLoggedIn = this.angFireAuth.authState;
    this.checkUserLogIn();
  }

  createUser(nickname: string): any{
    const auth = getAuth();
    this.users.push({
      uid: auth.currentUser.uid,
      nickname: nickname,
      banned: false,
      roles: ['user'],
      orders: []
    });

    return this.usersRef.add({
      uid: auth.currentUser.uid,
      nickname: nickname,
      banned: false,
      roles: ['user'],
      orders: []
    });
  }

  editUser(id:string, value: any): Promise<void>{
    return this.usersRef.doc(id).update(value);
  }

  getHighestRole(): string{
    const auth = getAuth();
    if (auth.currentUser != null) {
      let role = 'user';
      for (let user of this.users) {
        if (user.uid === auth.currentUser.uid) {
          for (let roleDB of user.roles) {
            if (roleDB === 'manager') {
              role = 'manager';
              //console.log('widac ze manager', role);
            } else if (roleDB === 'admin') {
              return 'admin';
            }
          }
          return role;
        }
      }
    }
  }

  getUserList(): AngularFirestoreCollection<User>{
    return this.usersRef;
  }

  setSessionPersistence(newPersistence: string, newPersEnum: Persistence ){
   // const auth = getAuth();
  //   setPersistence(auth, browserSessionPersistence)
  //     .then(() => {
  //       // Existing and future Auth states are now persisted in the current
  //       // session only. Closing the window would clear any existing state even
  //       // if a user forgets to sign out.
  //       // ...
  //       // New sign-in will be persisted with session persistence.
  //       return signInWithEmailAndPassword(auth, auth.currentUser.email, 'admin4');
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       console.log(errorCode,errorMessage);
  //   //   });
  //   })
    this.angFireAuth.setPersistence(newPersEnum).then(() => {
      alert("Log in persistence changed to:" + newPersistence);
    })
    const data = {
      currentPersistence: newPersistence
    }
    return this.persistenceRef.doc('0kZMW4qQJ8IHREaY2paj').update(data);
  }

  checkUserLogIn(){
    //let userData: Observable<firebase.User>
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
      if (user){
        console.log('user is logged in', user);
        this.currentLoggedNickname = user.displayName;
        this.userLoggedIn = true;
      }
      else {
        console.log('user isnt logged in', user);
        this.userLoggedIn = false;
      }
    })
    //userData = this.angFireAuth.authState
    //console.log(userData);
  }



}
