import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CineastRolesComponent } from './cineast-roles.component';

describe('CineastRolesComponent', () => {
  let component: CineastRolesComponent;
  let fixture: ComponentFixture<CineastRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CineastRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CineastRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
