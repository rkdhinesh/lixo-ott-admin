import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueCategoryComponent } from './venue-category.component';

describe('VenueCategoryComponent', () => {
  let component: VenueCategoryComponent;
  let fixture: ComponentFixture<VenueCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
