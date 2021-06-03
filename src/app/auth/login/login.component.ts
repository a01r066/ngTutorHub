import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      })
    });
  }

  onLogin(){
    this.authService.loginUser(this.loginForm.value).subscribe(res => {
      const user = (res as any).data;
      const token = (res as any).token;
      this.authService.setCurrentUser(token, user.email);
      // this.authService.authChanged.next(true);
      // this.authService.isAuthenticated = true;
      this.router.navigate(['']);
    }, error => {
      this.snackBar.open(`Invalid credential. Please try again!`, null!, {
        duration: 3000
      })
    });
  }

  onGmailFbRegister(type: any) {
    this.authService.loginViaGmailFB(type).then(res => {
      // console.log('gmail: '+JSON.stringify(res));
      const user = (res as any).user;
      const token = (res as any).credential.accessToken;
      this.authService.storeGmailFbUserData((res as any).user, token).subscribe(() => {
        this.authService.setCurrentUser(token, user.email);
        this.router.navigate(['']);
      });
    }).catch(error => {
      this.snackBar.open(`Gmail sign up failed: ${error.message}`, null!, {
        duration: 3000
      });
    });
  }
}
