import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../../../../home/Feedback/feedback.component";
import {DataStore} from "../../../../../../services/data.store";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.css']
})
export class UploadFileDialogComponent implements OnInit {

  ngForm!: FormGroup;
  fileData!: File;

  constructor(public dialogRef: MatDialogRef<UploadFileDialogComponent>,
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
      const chapterId = (this.data as any).chapter;
      this.dataStore.chapterFileUpload(chapterId, this.fileData).subscribe(res => {
        // Reload photo
        this.dialogRef.close();
        this.snackBar.open(`Chapter file uploaded!`, null!, {
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
