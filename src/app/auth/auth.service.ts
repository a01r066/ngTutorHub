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
  isAuthenticated = false;
  authChanged = new Subject<boolean>();

  constructor(private http: HttpClient) {
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
      this.authChanged.next(true);
      this.isAuthenticated = true;
    }, error => {
      // console.log(`User is un-authorized: ${error.message}`);
    })

    return this.user || undefined;
  }

  isAuth(){
    return this.isAuthenticated;
  }

  logout(){
    sessionStorage.removeItem('token');
    this.isAuthenticated = false;
    this.user = null!;
    this.authChanged.next(false);
  }
}
