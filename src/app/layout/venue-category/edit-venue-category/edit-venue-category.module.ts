import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditVenueCategoryComponent } from './edit-venue-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { EditVenueCategoryRoutingModule } from './edit-venue-category-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    EditVenueCategoryRoutingModule
  ],
  providers: [ TempDataService],
  declarations: [EditVenueCategoryComponent]
})
export class EditVenueCategoryModule { }
