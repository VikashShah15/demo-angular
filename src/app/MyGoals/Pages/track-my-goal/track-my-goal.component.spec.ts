import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackMyGoalComponent } from './track-my-goal.component';

describe('TrackMyGoalComponent', () => {
  let component: TrackMyGoalComponent;
  let fixture: ComponentFixture<TrackMyGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackMyGoalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackMyGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
