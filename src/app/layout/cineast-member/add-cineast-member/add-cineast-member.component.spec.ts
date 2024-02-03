import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCineastMemberComponent } from './add-cineast-member.component';

describe('AddCineastMemberComponent', () => {
  let component: AddCineastMemberComponent;
  let fixture: ComponentFixture<AddCineastMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCineastMemberComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCineastMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
