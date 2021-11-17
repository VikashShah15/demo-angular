import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoBudgetdetailComponent } from './step-two-budgetdetail.component';

describe('StepTwoBudgetdetailComponent', () => {
  let component: StepTwoBudgetdetailComponent;
  let fixture: ComponentFixture<StepTwoBudgetdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepTwoBudgetdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepTwoBudgetdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
