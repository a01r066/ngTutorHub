import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {AuthStore} from "../../services/auth.store";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ngForm!: FormGroup;
  isLoading$!: Observable<boolean>;

  constructor(
              private authStore: AuthStore,
              private router: Router) { }

  ngOnInit(): void {
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
    this.authStore.login(formData).subscribe((res) => {
      this.router.navigate(['']);
    });
  }

  onGmailFbRegister(type: any) {
    this.authStore.loginViaGmailFB(type).then(res => {
      // console.log(JSON.stringify(res.user));
      // Create use in the backend
      const user = res.user;
      // const token = (res as any).credential.accessToken;
      const formData = {
        "displayName": user!.displayName,
        "email": user!.email,
        "password": user!.uid,
        "photoURL": user?.photoURL,
        "isSocial": true
      }
      this.authStore.register(formData).subscribe((res) => {
        const token = (res as any).token;
        this.authStore.setCurrentUser(token);
        this.router.navigate(['']);
      })
    });
  }
}
