import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../home/Feedback/feedback.component";
import {DataStore} from "../../../services/data.store";

@Component({
  selector: 'app-coupon-dialog',
  templateUrl: './coupon-dialog.component.html',
  styleUrls: ['./coupon-dialog.component.css']
})
export class CouponDialogComponent implements OnInit {

  ngForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<CouponDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataStore: DataStore) { }

  ngOnInit(): void {
    this.ngForm = new FormGroup({
      code: new FormControl('', {validators: [Validators.required]}),
      description: new FormControl(),
      discount: new FormControl(0, { validators: [Validators.required]}),
      expire: new FormControl('', { validators: [Validators.required]}),
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
      // console.log('data: '+ (this.data as any).isEdit);
      const isEdit = (this.data as any).isEdit;
      const changes = this.ngForm.value;
      if(isEdit){
        const elementId = (this.data as any).element._id;
        this.dataStore.updateCoupon(elementId, changes).subscribe();
        this.dialogRef.close(changes);
      } else {
        this.dataStore.createCoupon(changes).subscribe();
        this.dialogRef.close(changes);
      }
    }
  }

  onChange(event: any) {
    // console.log(event.checked);
  }

}
