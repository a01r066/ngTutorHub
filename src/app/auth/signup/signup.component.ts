import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../auth.service";
import {UiService} from "../../services/ui.service";
import {map} from "rxjs/operators";
import {Store} from "@ngrx/store";
import * as fromApp from '../../app.reducer';
import {Observable} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading$!: Observable<boolean>;

  constructor(private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              private uiService: UiService,
              private store: Store<{ui: fromApp.State}>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(map(state => state.ui.isLoading));

    this.signupForm = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      })
    });
  }

  onRegister(){
    this.authService.registerUser(this.signupForm.value).subscribe(res => {
      this.store.dispatch({ type: 'STOP_LOADING' });
      if((res as any).statusCode === 401){
        this.snackBar.open(`${(res as any).message}`, null!, {
          duration: 3000
        });
      } else {
        const user = (res as any).data;

        const token = (res as any).token;
        this.authService.setCurrentUser(token, user.email);
        this.router.navigate(['']);
      }
    }, error => {
      this.store.dispatch({ type: 'STOP_LOADING' });
      this.snackBar.open(`Register error: ${error.message}`, null!, {
        duration: 3000
      });
    });
  }

  onGmailFbRegister(type: any) {
    this.authService.loginViaGmailFB(type).then(res => {
      this.store.dispatch({ type: 'STOP_LOADING' });
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
