import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPublishComponent } from './view-publish.component';

describe('ViewPublishComponent', () => {
  let component: ViewPublishComponent;
  let fixture: ComponentFixture<ViewPublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
