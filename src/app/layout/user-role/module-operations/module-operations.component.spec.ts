import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleOperationsComponent } from './module-operations.component';

describe('ModuleOperationsComponent', () => {
  let component: ModuleOperationsComponent;
  let fixture: ComponentFixture<ModuleOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
