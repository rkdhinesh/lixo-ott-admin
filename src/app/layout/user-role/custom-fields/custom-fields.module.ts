import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { CustomFieldsRoutingModule } from './custom-fields-routing.module';
import { CustomFieldsComponent } from './custom-fields.component';

@NgModule({
  imports: [
    CommonModule,
    CustomFieldsRoutingModule,
    MaterialModule
  ],
  declarations: [CustomFieldsComponent]
})
export class CustomFieldsModule { }
