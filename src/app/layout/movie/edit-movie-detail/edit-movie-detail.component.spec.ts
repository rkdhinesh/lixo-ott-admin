import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMovieDetailComponent } from './edit-movie-detail.component';

describe('EditMovieDetailComponent', () => {
  let component: EditMovieDetailComponent;
  let fixture: ComponentFixture<EditMovieDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMovieDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMovieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
