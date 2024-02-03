import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChargeComponent } from './add-charge.component';

describe('AddChargeComponent', () => {
  let component: AddChargeComponent;
  let fixture: ComponentFixture<AddChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
