import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../auth.service";
import {UiService} from "../../services/ui.service";
import {Store} from "@ngrx/store";
import * as fromApp from '../../app.reducer';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AuthStore} from "../../services/auth.store";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ngForm!: FormGroup;
  isLoading$!: Observable<boolean>;

  constructor(private authService: AuthService,
              private authStore: AuthStore,
              private router: Router,
              private snackBar: MatSnackBar,
              private uiService: UiService,
              private store: Store<{ui: fromApp.State}>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(map(state => state.ui.isLoading)); // transform the data

    this.ngForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      })
    });
  }

  onLogin(){
    const formData = this.ngForm.value;
    this.authStore.login(formData).subscribe(() => {
      this.router.navigate(['']);
    });
    // this.authService.loginUser(this.loginForm.value).subscribe(res => {
    //   this.store.dispatch({ type: 'STOP_LOADING' });
    //   const user = (res as any).data;
    //
    //   const token = (res as any).token;
    //   this.authService.setCurrentUser(token, user.email);
    //   this.router.navigate(['']);
    // }, error => {
    //   this.store.dispatch({ type: 'STOP_LOADING' });
    //   this.snackBar.open(`Invalid credential. Please try again!`, null!, {
    //     duration: 3000
    //   })
    // });
  }

  onGmailFbRegister(type: any) {
    this.authService.loginViaGmailFB(type).then(res => {
      this.store.dispatch({ type: 'STOP_LOADING' });
      // console.log('gmail: '+JSON.stringify(res));
      const user = (res as any).user;

      const token = (res as any).credential.accessToken;
      this.authService.storeGmailFbUserData((res as any).user, token).subscribe(() => {
        this.authService.setCurrentUser(token, user.email);
        this.router.navigate(['']);
      });
    }).catch(error => {
      this.store.dispatch({ type: 'STOP_LOADING' });
      this.snackBar.open(`Gmail sign up failed: ${error.message}`, null!, {
        duration: 3000
      });
    });
  }
}
