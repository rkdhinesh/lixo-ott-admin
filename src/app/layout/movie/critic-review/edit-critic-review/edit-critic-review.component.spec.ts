import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCriticReviewComponent } from './edit-critic-review.component';

describe('EditCriticReviewComponent', () => {
  let component: EditCriticReviewComponent;
  let fixture: ComponentFixture<EditCriticReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCriticReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCriticReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
