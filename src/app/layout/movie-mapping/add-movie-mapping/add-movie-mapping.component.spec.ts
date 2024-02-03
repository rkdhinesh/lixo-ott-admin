import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMovieMappingComponent } from './add-movie-mapping.component';

describe('AddMovieMappingComponent', () => {
  let component: AddMovieMappingComponent;
  let fixture: ComponentFixture<AddMovieMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMovieMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMovieMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
