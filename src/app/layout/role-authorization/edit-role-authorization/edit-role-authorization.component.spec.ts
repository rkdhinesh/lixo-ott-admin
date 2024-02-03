import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleAuthorizationComponent } from './edit-role-authorization.component';

describe('EditRoleAuthorizationComponent', () => {
  let component: EditRoleAuthorizationComponent;
  let fixture: ComponentFixture<EditRoleAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRoleAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoleAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
