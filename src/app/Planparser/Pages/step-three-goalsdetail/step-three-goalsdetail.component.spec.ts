import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeGoalsdetailComponent } from './step-three-goalsdetail.component';

describe('StepThreeGoalsdetailComponent', () => {
  let component: StepThreeGoalsdetailComponent;
  let fixture: ComponentFixture<StepThreeGoalsdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepThreeGoalsdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepThreeGoalsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
