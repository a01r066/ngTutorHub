import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {AuthStore} from "../../services/auth.store";
import {MessagesService} from "../../services/messages.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  ngForm!: FormGroup;
  isLoading$!: Observable<boolean>;

  constructor(
              private authStore: AuthStore,
              private messageService: MessagesService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.ngForm = new FormGroup({
      displayName: new FormControl('', {
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
    const formData = this.ngForm.value;
    this.authStore.register(formData).subscribe((res) => {
      if((res as any).success === false){
        this.messageService.showErrors(`${(res as any).message}`);
        this.snackBar.open(`${(res as any).message}`, null!, {
          duration: 3000
        })
      } else {
        // const token = (res as any).token;
        // this.authStore.setCurrentUser(token);
        this.router.navigate(['']);
      }
    });
  }

  onGmailFbRegister(type: any) {
    this.authStore.loginViaGmailFB(type).then(res => {
      // Create use in the backend
      const user = res.user;
      // const token = (res as any).credential.accessToken;
      const formData = {
        "displayName": user!.displayName,
        "email": user!.email,
        "password": user!.uid,
        "photoURL": user?.photoURL,
        // "accessToken": token,
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
