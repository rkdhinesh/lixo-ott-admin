import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVenueCategoryComponent } from './add-venue-category.component';

describe('AddVenueCategoryComponent', () => {
  let component: AddVenueCategoryComponent;
  let fixture: ComponentFixture<AddVenueCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVenueCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVenueCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
