import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../services/data.service";
import {AuthService} from "../../auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.authService.authChanged.subscribe(isAuth => {
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
    this.user = this.authService.user;
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
      fName: this.user.fName,
      lName: this.user.lName,
      headLine: this.user.headLine
    });
  }

  showInfo(index: any) {
    this.selectedIndex = index;
  }

  save() {
    let changes = this.profileForm.value;
    changes.displayName = this.profileForm.controls.fName.value + ' ' + this.profileForm.controls.lName.value;

    this.dataService.updateProfile(this.user._id, changes).subscribe(res => {
      // Reload user
      this.authService.initAuthListener();

      this.snackBar.open(`Your profile info is updated!`, null!, {
        duration: 3000
      })
    });
  }

  savePhoto() {
    this.dataService.updatePhotoProfile(this.user._id, this.fileData).subscribe(res => {
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
