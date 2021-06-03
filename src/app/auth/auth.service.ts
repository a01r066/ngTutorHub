import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Constants} from "../helpers/constants";
import {AngularFireAuth} from "@angular/fire/auth";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import firebase from 'firebase';
import {emailVerified} from "@angular/fire/auth-guard";

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
      "name": formData.name,
      "email": formData.email,
      "password": formData.password
    }
    const url = `${Constants.base_url}/auth/register`;
    return this.http.post(url, data);
  }

  // Store gmail user data to db
  storeGmailUserData(user: any, accessToken: any){
    // console.log('name: '+user.displayName);
    const data = {
      "name": user.displayName,
      "email": user.email,
      "password": user.uid,
      "photoURL": user.photoURL,
      "accessToken": accessToken
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

  loginViaFB(){

  }

  loginViaGmail(){
    return this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  // Set current user in your session after a successful login
  setCurrentUser(token: any, email: any): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('email', email);
    this.getCurrentUser();
  }

  loginWithGmailToken(accessToken: any, email: any) {
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

    if(token?.length === 165){
      // Gmail token
      this.loginWithGmailToken(token, email).subscribe(res => {
        this.user = (res as any).data;
        this.authChanged.next(true);
        this.isAuthenticated = true;
      });
    } else if(token?.length === 171){
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
    }

    return this.user || undefined;
  }

  isAuth(){
    return this.isAuthenticated;
  }

  logout(){
    this.afAuth.signOut().then();

    sessionStorage.removeItem('token');
    this.isAuthenticated = false;
    this.user = null!;
    this.authChanged.next(false);
  }
}
