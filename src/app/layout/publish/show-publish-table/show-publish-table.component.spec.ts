import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPublishTableComponent } from './show-publish-table.component';

describe('ShowPublishTableComponent', () => {
  let component: ShowPublishTableComponent;
  let fixture: ComponentFixture<ShowPublishTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPublishTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPublishTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
