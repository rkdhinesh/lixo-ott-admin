import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieMappingComponent } from './movie-mapping.component';

describe('MovieMappingComponent', () => {
  let component: MovieMappingComponent;
  let fixture: ComponentFixture<MovieMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
