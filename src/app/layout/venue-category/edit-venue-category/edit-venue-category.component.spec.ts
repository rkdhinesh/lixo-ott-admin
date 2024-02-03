import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVenueCategoryComponent } from './edit-venue-category.component';

describe('EditVenueCategoryComponent', () => {
  let component: EditVenueCategoryComponent;
  let fixture: ComponentFixture<EditVenueCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVenueCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVenueCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
