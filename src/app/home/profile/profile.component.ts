import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../services/data.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  base_url = 'http://localhost:3000/uploads/users';
  links = ['Profile', 'Photo'];
  profileForm!: FormGroup;
  user!: any;
  selectedIndex = 0;

  fileData!: File;
  previewUrl!: any;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    if(!this.user.isSocial){
      this.previewUrl = `${this.base_url}/${this.user.photoURL}`;
    } else {
      this.previewUrl = this.user.photoURL;
    }

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

  showInfo(index: any) {
    this.selectedIndex = index;
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

  savePhoto() {

  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    let mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }
}
