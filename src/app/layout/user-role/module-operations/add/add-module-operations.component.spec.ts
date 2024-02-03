import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModuleOperationsComponent } from './add-module-operations.component';

describe('AddModuleOperationsComponent', () => {
  let component: AddModuleOperationsComponent;
  let fixture: ComponentFixture<AddModuleOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModuleOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModuleOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
