import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocalityComponent } from './add-locality.component';

describe('AddLocalityComponent', () => {
  let component: AddLocalityComponent;
  let fixture: ComponentFixture<AddLocalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLocalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
