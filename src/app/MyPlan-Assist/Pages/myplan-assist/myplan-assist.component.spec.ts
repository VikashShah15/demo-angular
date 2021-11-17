import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyplanAssistComponent } from './myplan-assist.component';

describe('MyplanAssistComponent', () => {
  let component: MyplanAssistComponent;
  let fixture: ComponentFixture<MyplanAssistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyplanAssistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyplanAssistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
