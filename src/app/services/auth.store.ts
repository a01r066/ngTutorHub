import {BehaviorSubject, Observable, throwError} from "rxjs";
import {User} from "../models/user.model";
import {Injectable} from "@angular/core";
import {Constants} from "../helpers/constants";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "./loading.service";
import {MessagesService} from "./messages.service";
import {catchError, map, shareReplay, tap} from "rxjs/operators";

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
              private messageService: MessagesService) {
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));

    const userStr = localStorage.getItem(AUTH_DATA);
    if(userStr){
      this.subject.next(JSON.parse(userStr));
    }
  }

  register(formData: any): Observable<User> {
    const url = `${Constants.base_url}/auth/register`;
    return this.http.post(url, formData)
      .pipe(
        map(res => (res as any).data),
        catchError(err => {
          const message = `Register failed. ${err.message}`;
          this.messageService.showErrors(message);
          return throwError(err);
        }),
        tap(user => {
          this.subject.next(user);
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
          const message = `Login failed. ${err.message}`;
          this.messageService.showErrors(message);
          return throwError(err);
        }),
        tap(user => {
          this.subject.next(user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(user));
        }),
        shareReplay());
  }

  logout(){
    this.subject.next(null!);
    localStorage.removeItem(AUTH_DATA);
  }
}
