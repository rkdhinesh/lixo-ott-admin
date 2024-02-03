import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCineastMemberComponent } from './edit-cineast-member.component';

describe('EditCineastMemberComponent', () => {
  let component: EditCineastMemberComponent;
  let fixture: ComponentFixture<EditCineastMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCineastMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCineastMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
