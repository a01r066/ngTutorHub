import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DialogData} from "../../../home/Feedback/feedback.component";
import {DataStore} from "../../../services/data.store";

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {
  categoryForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataStore: DataStore) { }

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      title: new FormControl('', {validators: [Validators.required]}),
      isTop: new FormControl(false),
      isHidden: new FormControl(false)
    })

    const isEdit = (this.data as any).isEdit;
    if(isEdit){
      const category = (this.data as any).category;
      this.categoryForm.patchValue(category);
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    if(this.categoryForm.valid){
      // console.log('data: '+ (this.data as any).isEdit);
      const isEdit = (this.data as any).isEdit;
      const changes = this.categoryForm.value;
      if(isEdit){
        const categoryId = (this.data as any).category._id;
        this.dataStore.updateCategory(categoryId, changes).subscribe();
        this.dialogRef.close(changes);
      } else {
        this.dataStore.createCategory(changes).subscribe();
        this.dialogRef.close(changes);
      }
    }
  }

  onChange(event: any) {
    // console.log(event.checked);
  }
}
