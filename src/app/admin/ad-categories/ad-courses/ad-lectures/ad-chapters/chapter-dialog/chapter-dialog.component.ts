import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../../../../home/Feedback/feedback.component";
import {DataStore} from "../../../../../../services/data.store";

@Component({
  selector: 'app-chapter-dialog',
  templateUrl: './chapter-dialog.component.html',
  styleUrls: ['./chapter-dialog.component.css']
})
export class ChapterDialogComponent implements OnInit {

  ngForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<ChapterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataStore: DataStore) { }

  ngOnInit(): void {
    this.ngForm = new FormGroup({
      title: new FormControl('', {validators: [Validators.required]}),
      format: new FormControl('', {validators: [Validators.required]}),
      index: new FormControl('', { validators: [Validators.required]})
    })

    const isEdit = (this.data as any).isEdit;
    if(isEdit){
      const chapter = (this.data as any).chapter;
      this.ngForm.patchValue(chapter);
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    if(this.ngForm.valid){
      const isEdit = (this.data as any).isEdit;
      const changes = this.ngForm.value;
      if(isEdit){
        const chapterId = (this.data as any).chapter._id;
        console.log('ChapterId: '+chapterId);
        this.dataStore.updateChapter(chapterId, changes).subscribe(res => {
          console.log(JSON.stringify(res));
        });
        this.dialogRef.close(changes);
      } else {
        this.ngForm.value.lecture = (this.data as any).lectureId;
        this.dataStore.createChapter(changes).subscribe();
        this.dialogRef.close(changes);
      }
    }
  }

  onChange(event: any) {
    // console.log(event.checked);
  }

}
