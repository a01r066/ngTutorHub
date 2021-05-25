import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})

export class AuthService {
  base_url = 'http://localhost:3000/api/v1';

  user!: User;
  isLoggedIn = false;
  isAuthenticated = false;
  authChanged = new Subject<boolean>();

  constructor(private http: HttpClient) {
    // this.isLoggedIn = !!sessionStorage.getItem('token');
    // if (this.isLoggedIn){
    //   this.user = this.getCurrentUser();
    // }
  }

  initAuthListener(){
    this.user = this.getCurrentUser();
    if(this.user){
      console.log('LoggedUser: '+this.user.name);
    }
  }

  // Authentication
  registerUser(formData: any){
    const data = {
      "name": formData.name,
      "email": formData.email,
      "password": formData.password
    }
    const url = `${this.base_url}/auth/register`;
    return this.http.post(url, data);
  }

  loginUser(formData: any){
    const data = {
      "email": formData.email,
      "password": formData.password
    }
    const url = `${this.base_url}/auth/login`;
    return this.http.post(url, data);
  }

  getUser(){
    return {...this.user};
  }

  // Set current user in your session after a successful login
  setCurrentUser(token: string): void {
    sessionStorage.setItem('token', token);
    this.isLoggedIn = true;
  }

  // Get currently logged in user from session
  getCurrentUser(): User {
    const token = sessionStorage.getItem('token') || undefined;

    // Get user from db
    const url = `${this.base_url}/auth/me`;
    this.http.get(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).subscribe(res => {
      this.user = (res as any).data;
      console.log('Result: '+this.user.name);
    })

    return this.user || undefined;
  }

  isAuth(){
    return this.isAuthenticated;
  }

  logout(){

  }
}
