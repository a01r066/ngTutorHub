import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Constants} from "../helpers/constants";
import {AngularFireAuth} from "@angular/fire/auth";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import firebase from 'firebase';
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;

@Injectable({
  providedIn: "root"
})

export class AuthService {
  user!: User;
  isAuthenticated = false;
  authChanged = new Subject<boolean>();

  constructor(private http: HttpClient,
              private afAuth: AngularFireAuth) {
  }

  initAuthListener(){
    this.user = this.getCurrentUser();
  }

  // Authentication
  registerUser(formData: any){
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
    // console.log('name: '+user.displayName);
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
    const data = {
      "email": formData.email,
      "password": formData.password
    }
    const url = `${Constants.base_url}/auth/login`;
    return this.http.post(url, data);
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

  // Set current user in your session after a successful login
  setCurrentUser(token: any, email: any): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('email', email);
    this.getCurrentUser();
  }

  loginWithGmailFbToken(accessToken: any, email: any) {
    const data = {
      "email": email,
      "accessToken": accessToken
    }
    const url = `${Constants.base_url}/auth/gLogin`;
    return this.http.post(url, data);
  }

  // Get currently logged in user from session
  getCurrentUser(): User {
    const token = sessionStorage.getItem('token') || undefined;
    const email = sessionStorage.getItem('email') || undefined;

    if(token?.length === 171){
      // JWT token
      const url = `${Constants.base_url}/auth/me`;
      this.http.get(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      }).subscribe(res => {
        this.user = (res as any).data;
        this.authChanged.next(true);
        this.isAuthenticated = true;
      }, error => {
        // console.log(`User is un-authorized: ${error.message}`);
      })
    } else if(typeof token !== undefined) {
      // Gmail, facebook token
      this.loginWithGmailFbToken(token, email).subscribe(res => {
        this.user = (res as any).data;
        this.authChanged.next(true);
        this.isAuthenticated = true;
      });
    }

    return this.user || undefined;
  }

  isAuth(){
    return this.isAuthenticated;
  }

  logout(){
    this.afAuth.signOut().then();

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    this.isAuthenticated = false;
    this.user = null!;
    this.authChanged.next(false);
  }
}
