import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoneComponent } from './zone.component';
import { TempDataService } from '../../shared/temp-dataStore';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { ZoneRoutingModule } from './zone-routing.module';
import { FilterPipe } from './zone.pipes';
import { EditZoneModule } from './edit-zone/edit-zone.module';
import { ViewZoneModule } from './view-zone/view-zone.module';
import { ConfirmDialogComponent } from './ConfirmDialog/ConfirmDialogComponent';

@NgModule({
  imports: [
        CommonModule,
        PageHeaderModule,
        MaterialModule,
        RouterModule,
        ZoneRoutingModule,
        EditZoneModule,
        ViewZoneModule,
        FlexLayoutModule,
        FormsModule
    ],
    providers: [ TempDataService, ],
    declarations: [ ZoneComponent,FilterPipe,ConfirmDialogComponent],
    entryComponents: [ConfirmDialogComponent]
})
export class ZoneModule { }
  