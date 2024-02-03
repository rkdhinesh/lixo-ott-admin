import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveReviewComponent } from './approve-review.component';

describe('ApproveReviewComponent', () => {
  let component: ApproveReviewComponent;
  let fixture: ComponentFixture<ApproveReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
