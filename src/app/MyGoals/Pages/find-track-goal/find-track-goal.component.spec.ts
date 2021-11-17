import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindTrackGoalComponent } from './find-track-goal.component';

describe('FindTrackGoalComponent', () => {
  let component: FindTrackGoalComponent;
  let fixture: ComponentFixture<FindTrackGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindTrackGoalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindTrackGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
