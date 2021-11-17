import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { message } from 'src/app/Shared/Constant/alert.message';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../Service/auth.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  public feedbackForm: FormGroup;
  public feedback: any = [];
  private alertMessage = message;
  public isSubmitted = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private as: AuthService,
    public fb: FormBuilder,
    private router: Router,
    private messageService: MessageService) {
      this.loadForm();
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadForm(): any {
    const FormControlObject = {};
    this.feedback.forEach(res => {
      FormControlObject[res] =
        new FormControl(false);
    });
    this.feedbackForm = this.fb.group(FormControlObject);
    this.feedbackForm = new FormGroup({
      rating: new FormControl('', [Validators.required]),
      email: new FormControl('')
    });
  }
  loadData(): any {
    this.feedback = this.as.getFeedback();
    if (localStorage.getItem('cared-profile') != null) {
      const email = JSON.parse(localStorage.getItem('cared-profile')).email;
      this.feedbackForm.get('email').setValue(email);
    }
  }
  giveFeedback(): any {
    this.isSubmitted = true;
    if (this.feedbackForm.valid) {
      this.subscriptions[this.subscriptions.length] = this.as.addRating(JSON.stringify(this.feedbackForm.value)).subscribe(res => {
        if (res.status === 200) {
          this.router.navigate(['/planparser/Confirmation-Message']);
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.alertMessage.Error });
      });
    }
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
