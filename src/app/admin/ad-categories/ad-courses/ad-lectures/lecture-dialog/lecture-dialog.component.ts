import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../../../home/Feedback/feedback.component";
import {DataStore} from "../../../../../services/data.store";
import validate = WebAssembly.validate;

@Component({
  selector: 'app-lecture-dialog',
  templateUrl: './lecture-dialog.component.html',
  styleUrls: ['./lecture-dialog.component.css']
})
export class LectureDialogComponent implements OnInit {

  ngForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<LectureDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataStore: DataStore) { }

  ngOnInit(): void {
    this.ngForm = new FormGroup({
      title: new FormControl('', {validators: [Validators.required]}),
      index: new FormControl('', { validators: [Validators.required]}),
      course: new FormControl('', { validators: [Validators.required]})
    })

    const isEdit = (this.data as any).isEdit;
    if(isEdit){
      const lecture = (this.data as any).lecture;
      this.ngForm.patchValue(lecture);
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    if(this.ngForm.valid){
      // console.log('data: '+ (this.data as any).isEdit);
      const isEdit = (this.data as any).isEdit;
      const changes = this.ngForm.value;
      if(isEdit){
        const lectureId = (this.data as any).lecture._id;
        this.dataStore.updateLecture(lectureId, changes).subscribe();
        this.dialogRef.close(changes);
      } else {
        const courseId = (this.data as any).courseId;
        this.dataStore.createLecture(courseId, changes).subscribe();
        this.dialogRef.close(changes);
      }
    }
  }

  onChange(event: any) {
    // console.log(event.checked);
  }
}
