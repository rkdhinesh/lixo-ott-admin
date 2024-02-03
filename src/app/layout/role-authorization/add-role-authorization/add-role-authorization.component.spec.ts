import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleAuthorizationComponent } from './add-role-authorization.component';

describe('AddRoleAuthorizationComponent', () => {
  let component: AddRoleAuthorizationComponent;
  let fixture: ComponentFixture<AddRoleAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoleAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
