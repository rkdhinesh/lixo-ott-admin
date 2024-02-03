import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoleAuthorizationComponent } from './view-role-authorization.component';

describe('ViewRoleAuthorizationComponent', () => {
  let component: ViewRoleAuthorizationComponent;
  let fixture: ComponentFixture<ViewRoleAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRoleAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoleAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
