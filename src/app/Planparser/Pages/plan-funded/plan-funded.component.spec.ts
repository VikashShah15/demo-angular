import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanFundedComponent } from './plan-funded.component';

describe('PlanFundedComponent', () => {
  let component: PlanFundedComponent;
  let fixture: ComponentFixture<PlanFundedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanFundedComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanFundedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
