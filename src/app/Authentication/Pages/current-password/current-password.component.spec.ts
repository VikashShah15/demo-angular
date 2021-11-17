import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPasswordComponent } from './current-password.component';

describe('CurrentPasswordComponent', () => {
  let component: CurrentPasswordComponent;
  let fixture: ComponentFixture<CurrentPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
