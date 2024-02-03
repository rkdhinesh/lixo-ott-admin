import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxOfficeUserRoleComponent } from './box-office-user-role.component';

describe('BoxOfficeUserRoleComponent', () => {
  let component: BoxOfficeUserRoleComponent;
  let fixture: ComponentFixture<BoxOfficeUserRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxOfficeUserRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxOfficeUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
