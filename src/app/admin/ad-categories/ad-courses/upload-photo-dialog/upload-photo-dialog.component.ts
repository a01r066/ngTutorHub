import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../../home/Feedback/feedback.component";
import {DataStore} from "../../../../services/data.store";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-upload-photo-dialog',
  templateUrl: './upload-photo-dialog.component.html',
  styleUrls: ['./upload-photo-dialog.component.css']
})
export class UploadPhotoDialogComponent implements OnInit {
  ngForm!: FormGroup;
  fileData!: File;

  constructor(public dialogRef: MatDialogRef<UploadPhotoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataStore: DataStore,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.ngForm = new FormGroup({
      file: new FormControl('', {validators: [Validators.required]}),
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    if(this.ngForm.valid){
      const courseId = (this.data as any).course;
      this.dataStore.uploadCoursePhoto(courseId, this.fileData).subscribe(res => {
        // Reload photo
        this.dialogRef.close();
        this.snackBar.open(`Course photo uploaded!`, null!, {
          duration: 3000
        })
      });
    }
  }

  onChange(event: any) {
    // console.log(event.checked);
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }
}
