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
      const element = (this.data as any).element;
      const src = (this.data as any).src;
      if(src === 'category'){
        this.dataStore.uploadPhoto('categories', element._id, this.fileData).subscribe(res => {
          // Reload photo
          this.dialogRef.close();
          this.snackBar.open(`Category photo uploaded!`, null!, {
            duration: 3000
          })
        });
      } else if(src === 'instructor'){
        this.dataStore.uploadPhoto('instructors', element._id, this.fileData).subscribe(res => {
          // Reload photo
          this.dialogRef.close();
          this.snackBar.open(`Instructor photo uploaded!`, null!, {
            duration: 3000
          })
        });
      }
      else {
        this.dataStore.uploadPhoto('courses', element._id, this.fileData).subscribe(res => {
          // Reload photo
          this.dialogRef.close();
          this.snackBar.open(`Course photo uploaded!`, null!, {
            duration: 3000
          })
        });
      }
    }
  }

  onChange(event: any) {
    // console.log(event.checked);
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }
}
