import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOnePlandetailComponent } from './step-one-plandetail.component';

describe('StepOnePlandetailComponent', () => {
  let component: StepOnePlandetailComponent;
  let fixture: ComponentFixture<StepOnePlandetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepOnePlandetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepOnePlandetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
