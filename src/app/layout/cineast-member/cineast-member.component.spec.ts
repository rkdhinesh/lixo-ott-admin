import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CineastMemberComponent } from './cineast-member.component';

describe('CineastMemberComponent', () => {
  let component: CineastMemberComponent;
  let fixture: ComponentFixture<CineastMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CineastMemberComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CineastMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
