import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddScreenComponent } from './add-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddScreenRoutingModule } from './add-screen-routing.module';
import { TempDataService } from '../../../shared/temp-dataStore';
import { SeatLayoutDialogComponent } from '../seat-layout-dialog/seat-layout-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    AddScreenRoutingModule,
    

  ],
  providers: [ TempDataService],
  declarations: [AddScreenComponent,SeatLayoutDialogComponent]
})
export class AddScreenModule { }
