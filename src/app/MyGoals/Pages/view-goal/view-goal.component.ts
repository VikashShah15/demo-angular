import { Component, OnInit } from '@angular/core';
import { validations } from 'src/app/Shared/Constant/validation.constants';

@Component({
  selector: 'app-view-goal',
  templateUrl: './view-goal.component.html',
  styleUrls: ['./view-goal.component.scss']
})
export class ViewGoalComponent implements OnInit {
  id = 225;
  validationConstants = validations;
  constructor() { }

  ngOnInit(): void {
  }

}
