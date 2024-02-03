import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from '../../shared/temp-dataStore';
import { FareRoutingModule } from './fare-routing.module';
import { EditFareModule } from './edit-fare/edit-fare.module';
import { FareComponent } from './fare.component';
import { ViewFareModule } from './view-fare/view-fare.module';
import { FilterPipe } from './fare.pipes';

@NgModule({
  imports: [
        CommonModule,
        PageHeaderModule,
        MaterialModule,
        RouterModule,
        FareRoutingModule,
        EditFareModule,
        FlexLayoutModule,
        FormsModule,
        ViewFareModule,
    
    ],
    providers: [ TempDataService ],
    declarations: [ FareComponent,FilterPipe],
})
export class FareModule { }
