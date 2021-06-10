import {BehaviorSubject, Observable, throwError} from "rxjs";
import {User} from "../models/user.model";
import {Injectable} from "@angular/core";
import {Constants} from "../helpers/constants";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "./loading.service";
import {MessagesService} from "./messages.service";
import {catchError, map, shareReplay, tap} from "rxjs/operators";
import firebase from 'firebase';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import {AngularFireAuth} from "@angular/fire/auth";
import {MatSnackBar} from "@angular/material/snack-bar";

const AUTH_DATA = 'auth_data';

@Injectable({
  providedIn: "root"
})

export class AuthStore {
  private subject = new BehaviorSubject<User>(null!);
  user$: Observable<User> = this.subject.asObservable();

  isLoggedIn$!: Observable<boolean>;

  constructor(private http: HttpClient,
              private loadingService: LoadingService,
              private messageService: MessagesService,
              private afAuth: AngularFireAuth,
              private snackBar: MatSnackBar) {
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));

    // Load user from local storage
    const userStr = localStorage.getItem(AUTH_DATA);
    if(userStr){
      this.subject.next(JSON.parse(userStr));
    }
  }

  register(formData: any): Observable<User> {
    const url = `${Constants.base_url}/auth/register`;
    return this.http.post(url, formData)
      .pipe(
        map(res => (res as any)),
        catchError(err => {
          const message = `Register failed. ${err.message}`;
          // this.messageService.showErrors(message);
          this.snackBar.open(message, null!, {
            duration: 3000
          })
          return throwError(err);
        }),
        tap(res => {
          const user = (res as any).data;
          this.subject.next(res);
          localStorage.setItem(AUTH_DATA, JSON.stringify(user));
        }),
        shareReplay());
  }

  login(formData: any): Observable<User>{
    const url = `${Constants.base_url}/auth/login`;
    return this.http.post(url, formData)
      .pipe(
        map(res => (res as any).data),
        catchError(err => {
          const message = `Login failed. Invalid credential!`;
          // this.messageService.showErrors(message);
          this.snackBar.open(message, null!, {
            duration: 3000
          })
          return throwError(err);
        }),
        tap(user => {
          this.subject.next(user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(user));
        }),
        shareReplay());
  }

  loginViaGmailFB(type: any){
    let provider: any;
    if(type === 'fb'){
      provider = new FacebookAuthProvider();
    } else if(type === 'google') {
      provider = new GoogleAuthProvider();
    }
    return this.afAuth.signInWithPopup(provider);
  }

  logout(){
    this.subject.next(null!);
    localStorage.removeItem(AUTH_DATA);
  }
}
