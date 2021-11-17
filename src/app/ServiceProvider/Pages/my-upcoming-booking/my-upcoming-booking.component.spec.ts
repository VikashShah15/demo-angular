import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUpcomingBookingComponent } from './my-upcoming-booking.component';

describe('MyUpcomingBookingComponent', () => {
  let component: MyUpcomingBookingComponent;
  let fixture: ComponentFixture<MyUpcomingBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyUpcomingBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyUpcomingBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
