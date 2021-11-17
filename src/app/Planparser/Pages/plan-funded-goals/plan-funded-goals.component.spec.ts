import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanFundedGoalsComponent } from './plan-funded-goals.component';

describe('PlanFundedGoalsComponent', () => {
  let component: PlanFundedGoalsComponent;
  let fixture: ComponentFixture<PlanFundedGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanFundedGoalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanFundedGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
