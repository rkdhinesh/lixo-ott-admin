import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatLayoutComponent } from './seat-layout.component';
import { TempDataService } from '../../../shared/temp-dataStore';
import { SeatLayoutRoutingModule } from './seat-layout-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    SeatLayoutRoutingModule
  ],
  providers: [ TempDataService],
  declarations: [SeatLayoutComponent]
})
export class SeatLayoutModule { }
