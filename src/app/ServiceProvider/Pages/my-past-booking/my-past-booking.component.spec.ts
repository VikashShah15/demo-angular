import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPastBookingComponent } from './my-past-booking.component';

describe('MyPastBookingComponent', () => {
  let component: MyPastBookingComponent;
  let fixture: ComponentFixture<MyPastBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPastBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPastBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
