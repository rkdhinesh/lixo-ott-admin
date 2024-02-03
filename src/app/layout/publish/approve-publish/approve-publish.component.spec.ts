import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePublishComponent } from './approve-publish.component';

describe('ApprovePublishComponent', () => {
  let component: ApprovePublishComponent;
  let fixture: ComponentFixture<ApprovePublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovePublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
