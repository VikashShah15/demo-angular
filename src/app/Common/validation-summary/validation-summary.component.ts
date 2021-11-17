import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';

@Component({
  selector: 'app-validation-summary',
  templateUrl: './validation-summary.component.html',
  styleUrls: ['./validation-summary.component.scss']
})
export class ValidationSummaryComponent implements OnInit {
  @Input() form: NgForm;
  public errors: string[] = [];
  private subscriptions: Subscription[] = [];
  constructor() { }

  ngOnInit(): any {
    this.statusChange();
  }
  statusChange(): any {
    this.subscriptions[this.subscriptions.length] = this.form.statusChanges.subscribe(status => {
      this.resetErrorMessages();
      this.generateErrorMessages(this.form['controls']['details']['controls']);
    });
  }

  resetErrorMessages(): any {
    this.errors.length = 0;
  }

  generateErrorMessages(formGroup: any): any {
    formGroup.forEach(element => {
      Object.keys(element.controls).forEach(controlName => {
        const control = element.controls[controlName];
        const errors = control.errors;
        if (errors === null || errors.count === 0) {
          return;
        }
        // Handle the 'required' case
        if (errors.required) {
          this.errors.push(`${controlName} is required`);
        }
        // Handle 'minlength' case
        if (errors.minLength) {
          this.errors.push(`${controlName} should be greater than 0.`);
        }
        if (errors.min) {
          this.errors.push(`${controlName} should be greater than 0.`);
        }
        // Handle custom messages.
        if (errors.message) {
          this.errors.push(`${controlName} ${errors.message}`);
        }
        if (errors.greater) {
          this.errors.push(`${controlName} should not be greater than total budget.`);
        }
      });
    });

  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
