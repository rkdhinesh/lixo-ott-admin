import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVenueCategoryComponent } from './view-venue-category.component';

describe('ViewVenueCategoryComponent', () => {
  let component: ViewVenueCategoryComponent;
  let fixture: ComponentFixture<ViewVenueCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVenueCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVenueCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
