import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddVenueCategoryComponent } from './add-venue-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { AddVenueCategoryRoutingModule } from './add-venue-category-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    CommonModule,
    AddVenueCategoryRoutingModule],
  providers: [ TempDataService],
  declarations: [AddVenueCategoryComponent]
})
export class AddVenueCategoryModule { }
