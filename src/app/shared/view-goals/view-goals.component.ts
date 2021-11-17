import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { message } from '../../Shared/Constant/alert.message';
import { validations } from '../../Shared/Constant/validation.constants';
import { MessageServices } from 'src/app/shared/services/message.service';
import { MyGoalService } from 'src/app/MyGoals/Service/mygoal.service';
import { unsubscribeCollection } from '../utils/common-utilities.util';


@Component({
  selector: 'app-view-goals',
  templateUrl: './view-goals.component.html',
  styleUrls: ['./view-goals.component.scss']
})
export class ViewGoalsComponent implements OnInit {
  @Input() GoalId;
  goalsForm: FormGroup;
  items = [];
  alertMessage = message;
  validationConstants = validations;
  isSubmitted = false;
  planId: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageServices,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private gs: MyGoalService
  ) {
    this.loadForm();
  }
  loadForm(): any {
    this.items.push(this.fb.group({
      description: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      achieveGoal: new FormControl('', [Validators.required]),
      supportGoal: new FormControl('', [Validators.required])
    }));
    this.goalsForm = this.fb.group({
      details: this.fb.array(this.items)
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData(): any {
    this.messageService.sendMessage({ cmd: '/view-goals' });
    this.subscriptions[this.subscriptions.length] = this.route.params.subscribe(i => {
      this.planId = i.id;
      this.subscriptions[this.subscriptions.length] =  this.gs.getGoalByPlanId(this.planId).subscribe(res => {
      });
    });
  }
  goalSubmit = () => {
    this.isSubmitted = true;
  }
 /**
  * @description Component lifecycle method, gets called when component destroys
  */
  ngOnDestroy(): void {
    unsubscribeCollection(this.subscriptions);
  }


}
