import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCineastRolesComponent } from './edit-cineast-roles.component';

describe('EditCineastRolesComponent', () => {
  let component: EditCineastRolesComponent;
  let fixture: ComponentFixture<EditCineastRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCineastRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCineastRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
