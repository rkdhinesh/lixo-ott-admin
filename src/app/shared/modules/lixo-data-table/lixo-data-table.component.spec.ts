import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LixoDataTableComponent } from './lixo-data-table.component';

describe('LixoDataTableComponent', () => {
  let component: LixoDataTableComponent;
  let fixture: ComponentFixture<LixoDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LixoDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LixoDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
