import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyServiceProvidersComponent } from './my-service-providers.component';

describe('MyServiceProvidersComponent', () => {
  let component: MyServiceProvidersComponent;
  let fixture: ComponentFixture<MyServiceProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyServiceProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyServiceProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
