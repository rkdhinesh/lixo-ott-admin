import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPublishComponent } from './edit-publish.component';

describe('EditPublishComponent', () => {
  let component: EditPublishComponent;
  let fixture: ComponentFixture<EditPublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
