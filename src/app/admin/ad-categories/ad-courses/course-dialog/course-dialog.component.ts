import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../../home/Feedback/feedback.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessagesService} from "../../../../services/messages.service";
import {LoadingService} from "../../../../services/loading.service";
import {DataStore} from "../../../../services/data.store";
import {AuthStore} from "../../../../services/auth.store";
import {User} from "../../../../models/user.model";
import {Coupon} from "../../../../models/coupon.model";

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  providers: [MessagesService, LoadingService]
})
export class CourseDialogComponent implements OnInit {
  ngForm!: FormGroup;
  user!: User;
  coupons: Coupon[] = [];
  @ViewChild('coupon') couponRef!: ElementRef;
  currentCoupon!: Coupon;
  isEdit = false

  constructor(public dialogRef: MatDialogRef<CourseDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataStore: DataStore,
              private snackBar: MatSnackBar,
              private authStore: AuthStore) { }

  ngOnInit(): void {
    this.isEdit = (this.data as any).isEdit;
    this.ngForm = new FormGroup({
      title: new FormControl('', {validators: [Validators.required, Validators.maxLength(256)]}),
      instructor: new FormControl('', {validators: [Validators.required, Validators.maxLength(64)]}),
      objectives: new FormControl('', { validators: [Validators.required]}),
      description: new FormControl('', {validators: [Validators.required]}),
      bestseller: new FormControl(false),
      tuition: new FormControl('', {validators: [Validators.required]}),
      isFree: new FormControl(false),
      isHidden: new FormControl(false),
      coupon: new FormControl('60cb280400cdcf361c32d4f4')
    })

    if(this.isEdit){
      const course = (this.data as any).course;
      this.currentCoupon = course.coupon;
      this.ngForm.patchValue(course);
    }

    this.authStore.user$.subscribe(user => {
      this.user = user;
    })

    this.dataStore.getCoupons().subscribe(coupons => {
      this.coupons = coupons;
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    if(this.ngForm.valid){
      if(this.isEdit){
        const courseId = (this.data as any).course._id;
        const changes = this.ngForm.value;
        this.dataStore.updateCourse(courseId, changes).subscribe();
        this.dialogRef.close(changes);
      } else {
        let formData = this.ngForm.value;
        formData.user = this.user._id; // add user field to formData
        formData.category = (this.data as any).categoryId;
        this.dataStore.createCourse(formData).subscribe(() => {
          this.dialogRef.close();
          this.snackBar.open('Course added success!', null!, {
            duration: 3000
          })
        });
      }
    }
  }

  onChange(event: any) {
    console.log(event.checked);
  }

}
