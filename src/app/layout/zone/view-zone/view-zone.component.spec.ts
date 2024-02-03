import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewZoneComponent } from './view-zone.component';

describe('ViewZoneComponent', () => {
  let component: ViewZoneComponent;
  let fixture: ComponentFixture<ViewZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
