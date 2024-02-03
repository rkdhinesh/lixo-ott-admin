import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatLayoutDialogComponent } from './seat-layout-dialog.component';

describe('SeatLayoutDialogComponent', () => {
  let component: SeatLayoutDialogComponent;
  let fixture: ComponentFixture<SeatLayoutDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatLayoutDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatLayoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
