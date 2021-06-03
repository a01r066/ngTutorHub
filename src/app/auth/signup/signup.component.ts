import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
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
      const user = (res as any).data;
      const token = (res as any).token;
      this.authService.setCurrentUser(token, user.email);
      this.router.navigate(['']);
    }, error => {
      this.snackBar.open(`Register error: ${error.message}`, null!, {
        duration: 3000
      });
    });
  }

  onFbRegister() {
    console.log('fb');
  }

  onGmailRegister() {
    this.authService.loginViaGmail().then(res => {
      // console.log('gmail: '+JSON.stringify(res));
      const user = (res as any).user;
      const token = (res as any).credential.accessToken;
      // console.log('token: '+token);
      // sessionStorage.setItem('token', token);
      // sessionStorage.setItem('email', user.email);
      this.authService.storeGmailUserData((res as any).user, token).subscribe(() => {
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
