import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../home/Feedback/feedback.component";
import {DataStore} from "../../../services/data.store";

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {
  ngForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataStore: DataStore) {}

  ngOnInit(): void {
    this.ngForm = new FormGroup({
      displayName: new FormControl(),
      purchased_courses: new FormControl(),
      role: new FormControl()
    })

    const isEdit = (this.data as any).isEdit;
    if(isEdit){
      const element = (this.data as any).element;
      this.ngForm.patchValue(element);
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {

  }
}
