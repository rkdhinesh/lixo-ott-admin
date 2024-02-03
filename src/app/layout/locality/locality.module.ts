import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalityComponent } from './locality.component';
import { TempDataService } from '../../shared/temp-dataStore';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { LocalityRoutingModule } from './locality-routing.module';
import { EditLocalityModule } from './edit-locality/edit-locality.module';
import { FilterPipe } from './locality.pipes';
import { ViewLocalityModule } from './view-locality/view-locality.module';

@NgModule({ 
    imports: [
        CommonModule,
        PageHeaderModule,
        MaterialModule,
        RouterModule,
        LocalityRoutingModule,
        EditLocalityModule,
        ViewLocalityModule,
        FlexLayoutModule,
        FormsModule
    ],
    providers: [TempDataService],
    declarations: [LocalityComponent, FilterPipe],
})
export class LocalityModule { }
