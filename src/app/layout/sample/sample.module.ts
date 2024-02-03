import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleRoutingModule } from './sample-routing.module';
import { SampleComponent } from './sample.component';
import { MaterialModule } from '../../shared/components/MaterialModule';

@NgModule({
  imports: [
    CommonModule,
    SampleRoutingModule,MaterialModule
  ],
  declarations: [SampleComponent]
})
export class SampleModule { }
