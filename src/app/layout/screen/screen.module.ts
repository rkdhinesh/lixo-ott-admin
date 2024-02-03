import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenComponent } from './screen.component';
import { TempDataService } from '../../shared/temp-dataStore';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditScreenModule } from './edit/edit-screen.module';
import { ScreenRoutingModule } from './screen-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../shared';
import { ScreenFilterPipe } from './screen.pipes';
import { SeatLayoutModule } from './seat-layout/seat-layout.module';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    ScreenRoutingModule,
    EditScreenModule,
    FlexLayoutModule,
    SeatLayoutModule,
    FormsModule
],

providers: [ TempDataService ],
declarations: [ ScreenComponent,ScreenFilterPipe],
})
export class ScreenModule { }
