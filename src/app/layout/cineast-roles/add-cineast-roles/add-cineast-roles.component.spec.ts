import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCineastRolesComponent } from './add-cineast-roles.component';

describe('AddCineastRolesComponent', () => {
  let component: AddCineastRolesComponent;
  let fixture: ComponentFixture<AddCineastRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCineastRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCineastRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
