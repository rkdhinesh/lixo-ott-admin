import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModuleOperationsComponent } from './edit-module-operations.component';

describe('EditModuleOperationsComponent', () => {
  let component: EditModuleOperationsComponent;
  let fixture: ComponentFixture<EditModuleOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModuleOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModuleOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
