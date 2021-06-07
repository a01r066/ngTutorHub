import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Constants} from "../helpers/constants";
import {AngularFireAuth} from "@angular/fire/auth";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import firebase from 'firebase';
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import {UiService} from "../../services/ui.service";
import {Store} from "@ngrx/store";
import * as fromApp from '../app.reducer';
import {map, shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})

export class AuthService {
  user!: User;
  authChanged = new Subject<boolean>();

  constructor(private http: HttpClient,
              private afAuth: AngularFireAuth,
              private uiService: UiService,
              private store: Store<{ui: fromApp.State}>) {
  }

  initAuthListener(){
    this.subScribeCurrentUser();
  }

  // Set current user in your session after a successful login
  setCurrentUser(token: any, email: any): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('email', email);

    this.subScribeCurrentUser();
  }

  subScribeCurrentUser(){
    this.getCurrentUser().subscribe(user => {
      this.user = user;
      this.authChanged.next(true);
    });
  }

  // Get currently logged in user from session
  getCurrentUser(): Observable<User> {
    const token = sessionStorage.getItem('token') || undefined;
    const email = sessionStorage.getItem('email') || undefined;

    if(token?.length === 171){
      // JWT token
      const url = `${Constants.base_url}/auth/me`;
      return this.http.get<User>(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
        .pipe(
          map(res => (res as any).data), shareReplay());
    }
    else {
      const data = {
        "email": email,
        "accessToken": token
      }
      const url = `${Constants.base_url}/auth/gLogin`;
      return this.http.post(url, data)
        .pipe(
          map(res => (res as any).data), shareReplay());
    }
  }

  // Authentication
  registerUser(formData: any){
    this.store.dispatch({ type: 'START_LOADING' });
    const data = {
      "displayName": formData.name,
      "email": formData.email,
      "password": formData.password,
      "isSocial": false
    }
    const url = `${Constants.base_url}/auth/register`;
    return this.http.post(url, data);
  }

  // Store gmail user data to db
  storeGmailFbUserData(user: any, accessToken: any){
    const data = {
      "displayName": user.displayName,
      "email": user.email,
      "password": user.uid,
      "photoURL": user.photoURL,
      "accessToken": accessToken,
      "isSocial": true
    }
    const url = `${Constants.base_url}/auth/register`;
    return this.http.post(url, data);
  }

  loginUser(formData: any){
    this.store.dispatch({ type: 'START_LOADING' });
    const data = {
      "email": formData.email,
      "password": formData.password
    }
    const url = `${Constants.base_url}/auth/login`;
    return this.http.post(url, data);
  }

  loginViaGmailFB(type: any){
    this.store.dispatch({ type: 'START_LOADING' });
    let provider: any;
    if(type === 'fb'){
      provider = new FacebookAuthProvider();
    } else if(type === 'google') {
      provider = new GoogleAuthProvider();
    }
    return this.afAuth.signInWithPopup(provider);
  }

  logout(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    this.afAuth.signOut().then();
    this.user = null!;
    this.authChanged.next(false);
  }
}
