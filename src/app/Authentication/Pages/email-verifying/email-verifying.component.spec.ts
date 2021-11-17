import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerifyingComponent } from './email-verifying.component';

describe('EmailVerifyingComponent', () => {
  let component: EmailVerifyingComponent;
  let fixture: ComponentFixture<EmailVerifyingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailVerifyingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerifyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
