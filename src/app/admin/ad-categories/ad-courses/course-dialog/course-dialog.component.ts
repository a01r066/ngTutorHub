import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../../home/Feedback/feedback.component";
import {DataService} from "../../../../services/data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../auth/auth.service";
import {MessagesService} from "../../../../services/messages.service";
import {LoadingService} from "../../../../services/loading.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {DataStore} from "../../../../services/data.store";

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  providers: [MessagesService, LoadingService]
})
export class CourseDialogComponent implements OnInit {
  ngForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<CourseDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private dataStore: DataStore,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              public loadingService: LoadingService,
              public messageService: MessagesService) { }

  ngOnInit(): void {
    this.ngForm = new FormGroup({
      title: new FormControl('', {validators: [Validators.required, Validators.maxLength(64)]}),
      objectives: new FormControl('', { validators: [Validators.required]}),
      description: new FormControl('', {validators: [Validators.required]}),
      bestseller: new FormControl(false),
      tuition: new FormControl('', {validators: [Validators.required]}),
      isFree: new FormControl(false),
      isHidden: new FormControl(false)
    })

    const isEdit = (this.data as any).isEdit;
    if(isEdit){
      const course = (this.data as any).course;
      this.ngForm.patchValue(course);
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    if(this.ngForm.valid){
      const isEdit = (this.data as any).isEdit;
      if(isEdit){
        const courseId = (this.data as any).course._id;
        const changes = this.ngForm.value;
        this.dataStore.updateCourse(courseId, changes).subscribe();
        this.dialogRef.close(changes);
        // const loading$ = this.dataService.updateCourse((this.data as any).course._id, this.ngForm.value).pipe(catchError(err => {
        //   const message = 'Update course failed. Please check your internet connection!';
        //   this.messageService.showErrors(message);
        //   return throwError(err);
        // }));
        //
        // this.loadingService.showLoaderUntilCompleted(loading$).subscribe(res => {
        //   this.dialogRef.close();
        //   this.snackBar.open('Course updated success!', null!, {
        //     duration: 3000
        //   })
        // });
      } else {
        let formData = this.ngForm.value;
        formData.user = this.authService.user._id;
        formData.category = (this.data as any).categoryId;
        const loading$ = this.dataService.createCourse(formData).pipe(catchError(err => {
          const message = 'Create course failed. Please check your internet connection!';
          this.messageService.showErrors(message);
          return throwError(err);
        }));

        this.loadingService.showLoaderUntilCompleted(loading$)
          .subscribe(res => {
            this.dialogRef.close();
          this.snackBar.open('Course added success!', null!, {
            duration: 3000
          })
        });
      }
      // this.dialogRef.close();
    }
  }

  onChange(event: any) {
    console.log(event.checked);
  }

}
