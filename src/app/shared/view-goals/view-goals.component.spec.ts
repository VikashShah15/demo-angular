import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGoalsComponent } from './view-goals.component';

describe('ViewGoalsComponent', () => {
  let component: ViewGoalsComponent;
  let fixture: ComponentFixture<ViewGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGoalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
