import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../services/data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogData} from "../../../home/Feedback/feedback.component";

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {
  categoryForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      title: new FormControl('', {validators: [Validators.required]}),
      isTop: new FormControl(false),
      isHidden: new FormControl(false)
    })

    const isEdit = (this.data as any).isEdit;
    if(isEdit){
      const category = (this.data as any).category;
      this.categoryForm.patchValue({
        title: category.title,
        isTop: category.isTop,
        isHidden: category.isHidden
      })
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    if(this.categoryForm.valid){
      // console.log('data: '+ (this.data as any).isEdit);
      const isEdit = (this.data as any).isEdit;
      if(isEdit){
        this.dataService.updateCategory((this.data as any).category._id, this.categoryForm.value).subscribe(res => {
          this.snackBar.open('Category updated success!', null!, {
            duration: 3000
          })
        });
      } else {
        this.dataService.createCategory(this.categoryForm.value).subscribe(res => {
          this.snackBar.open('Category added success!', null!, {
            duration: 3000
          })
        });
      }
      this.dialogRef.close();
    }
  }

  onChange(event: any) {
    console.log(event.checked);
  }
}
