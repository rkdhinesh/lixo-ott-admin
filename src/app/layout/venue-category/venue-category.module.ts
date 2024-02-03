import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueCategoryComponent } from './venue-category.component';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { VenueCategoryRoutingModule } from './venue-category-routing.module';
import { EditVenueCategoryModule } from './edit-venue-category/edit-venue-category.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from '../../shared/temp-dataStore';
import { FilterPipe } from './venue-category.pipes';
import { ViewVenueCategoryModule } from './view-venue-category/view-venue-category.module';

@NgModule({
  imports: [
        CommonModule,
        PageHeaderModule,
        MaterialModule,
        RouterModule,
        VenueCategoryRoutingModule,
       EditVenueCategoryModule,
       ViewVenueCategoryModule,
        FlexLayoutModule,
        FormsModule
    ],
    providers: [ TempDataService ],
    declarations: [ VenueCategoryComponent,FilterPipe],
})
export class VenueCategoryModule { }
