import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrackGoalComponent } from './add-track-goal.component';

describe('AddTrackGoalComponent', () => {
  let component: AddTrackGoalComponent;
  let fixture: ComponentFixture<AddTrackGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrackGoalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrackGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
