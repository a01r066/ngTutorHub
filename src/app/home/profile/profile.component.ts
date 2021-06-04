import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import validate = WebAssembly.validate;
import {DataService} from "../../../services/data.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  links = ['Profile', 'Photo'];
  profileForm!: FormGroup;
  user!: any;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.authService.authChanged.subscribe(isAuth => {
      this.user = this.authService.user;
    })

    this.profileForm = new FormGroup({
      fName: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(16)]
      }),
      lName: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(16)]
      }),
      headLine: new FormControl('')
    })

    this.patchFormValues();
  }

  showInfo(link: any) {

  }

  save() {
    const formData = this.profileForm.value;
    this.dataService.updateProfile(formData, this.user._id).subscribe(res => {
      this.authService.getCurrentUser();
    });
  }

  private patchFormValues() {
    this.profileForm.patchValue({
      fName: this.user.fName,
      lName: this.user.lName,
      headLine: this.user.headLine
    });
  }
}
