import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DataStore} from "../../services/data.store";
import {Constants} from "../../helpers/constants";
import {AuthStore} from "../../services/auth.store";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // base_url = 'http://localhost:3000/uploads/users';
  base_url = `${Constants.base_upload}/users/`;

  links = ['Profile', 'Photo'];
  profileForm!: FormGroup;
  user!: any;
  selectedIndex = 0;

  fileData!: File;
  previewUrl!: any;

  constructor(
    private dataStore: DataStore,
    private authStore: AuthStore,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe(user => {
      this.user = user;
      this.reloadData();
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

    this.reloadData();
  }

  reloadData(){
    this.patchFormValues();
    this.getPhotoURL();
  }

  private getPhotoURL() {
    if(!this.user.isSocial){
      this.previewUrl = `${this.base_url}/${this.user.photoURL}`;
    } else {
      this.previewUrl = this.user.photoURL;
    }
  }

  private patchFormValues() {
    this.profileForm.patchValue({
      fName: this.user?.fName,
      lName: this.user?.lName,
      headLine: this.user?.headLine
    });
  }

  showInfo(index: any) {
    this.selectedIndex = index;
  }

  save() {
    let changes = this.profileForm.value;
    changes.displayName = this.profileForm.controls.fName.value + ' ' + this.profileForm.controls.lName.value;

    this.dataStore.updateProfile(this.user._id, changes).subscribe(res => {
      // Reload user
      this.authStore.initAuthListener();

      this.snackBar.open(`Your profile info is updated!`, null!, {
        duration: 3000
      })
    });
  }

  savePhoto() {
    this.dataStore.updatePhotoProfile(this.user._id, this.fileData).subscribe(res => {
      // Reload photo
      // this.authService.initAuthListener();
      this.snackBar.open(`Your profile photo is updated!`, null!, {
        duration: 3000
      })
    });
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
