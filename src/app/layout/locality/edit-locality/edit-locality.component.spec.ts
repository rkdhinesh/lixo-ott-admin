import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLocalityComponent } from './edit-locality.component';

describe('EditLocalityComponent', () => {
  let component: EditLocalityComponent;
  let fixture: ComponentFixture<EditLocalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLocalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
