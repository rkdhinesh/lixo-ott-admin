import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLocalityComponent } from './view-locality.component';

describe('ViewLocalityComponent', () => {
  let component: ViewLocalityComponent;
  let fixture: ComponentFixture<ViewLocalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLocalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLocalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
