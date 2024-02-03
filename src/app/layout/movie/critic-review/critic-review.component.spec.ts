import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticReviewComponent } from './critic-review.component';

describe('CriticReviewComponent', () => {
  let component: CriticReviewComponent;
  let fixture: ComponentFixture<CriticReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
