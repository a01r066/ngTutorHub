import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../home/Feedback/feedback.component";
import {DataStore} from "../../../services/data.store";

@Component({
  selector: 'app-instructor-dialog',
  templateUrl: './instructor-dialog.component.html',
  styleUrls: ['./instructor-dialog.component.css']
})
export class InstructorDialogComponent implements OnInit {
  ngForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<InstructorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataStore: DataStore) { }

  ngOnInit(): void {
    this.ngForm = new FormGroup({
      name: new FormControl('', {validators: [Validators.required]}),
      profession: new FormControl(),
      highlight: new FormControl(),
      students: new FormControl(),
      rating: new FormControl(),
      reviews: new FormControl(),
      categoryId: new FormControl()
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
    if(this.ngForm.valid){
      const isEdit = (this.data as any).isEdit;
      const changes = this.ngForm.value;
      if(isEdit){
        // Update
        const element = (this.data as any).element;
        this.dataStore.updateInstructor(element._id, changes).subscribe();
      } else {
        // Create
        this.dataStore.createInstructor(changes).subscribe();
      }
      this.dialogRef.close(changes);
    }
  }
}
