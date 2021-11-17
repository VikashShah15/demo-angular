import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../Service/auth.service';
import { unsubscribeCollection } from 'src/app/shared/utils/common-utilities.util';
@Component({
  selector: 'app-current-password',
  templateUrl: './current-password.component.html',
  styleUrls: ['./current-password.component.scss']
})
export class CurrentPasswordComponent implements OnInit, OnDestroy {
  public currentPasswordForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(private sd: AuthService) {
    this.currentPasswordForm = new FormGroup({
      currentpassword: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
  }
  public currentPasswordSubmit = () => {
    this.subscriptions[this.subscriptions.length] =
    this.sd.currentpassword(this.currentPasswordForm.controls.currentpassword.value).subscribe(res => {
    });
  }
  /**
   * @description Component lifecycle method, gets called when component destroys
   */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }
}
