import {Component, ElementRef, Inject, OnInit, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../models/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../services/data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingService} from "../../../services/loading.service";

export interface DialogData {
  user: User;
}

@Component({
  selector: 'app-feedback',
  templateUrl: './dialog-feedback.html',
  styleUrls: ['./feedback.component.css'],
  providers: [LoadingService]
})
export class FeedbackComponent implements OnInit{
  feedbackForm!: FormGroup;
  @ViewChild('messageText') messageRef!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<FeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService) {}

    ngOnInit(): void {
      this.feedbackForm = new FormGroup({
        displayName: new FormControl('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(48)]}),
        email: new FormControl('', { validators: [Validators.required, Validators.email]}),
        subject: new FormControl('', { validators: [Validators.maxLength(512)]}),
        message: new FormControl('', { validators: [Validators.required, Validators.minLength(12), Validators.maxLength(1024)]})
      })

      this.patchValues();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  send() {
    if(this.feedbackForm.valid){
      const createFeedback$ = this.dataService.createFeedback(this.feedbackForm.value, this.data.user._id);
      this.loadingService.showLoaderUntilCompleted(createFeedback$)
      .subscribe(res => {
        this.dialogRef.close();
        this.snackBar.open(`Thank you for your feedback!`, null!, {
          duration: 3000
        })
      })
    }
  }

  private patchValues() {
    this.feedbackForm.patchValue({
      displayName: this.data.user.displayName,
      email: this.data.user.email
    })
  }
}
