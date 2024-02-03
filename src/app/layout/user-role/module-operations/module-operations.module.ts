import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleOperationsComponent } from './module-operations.component';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { ModuleOperationsRoutingModule } from './module-operations-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { PageHeaderModule } from '../../../shared';
import { FormsModule } from '@angular/forms';
import { EditModuleOperationsModule } from './edit/edit-module-operations.module';
import { TempDataService } from '../../../shared/temp-dataStore';
import { ModuleOperationsFilterPipe } from './module-operations.pipes';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    ModuleOperationsRoutingModule,
    EditModuleOperationsModule,
    FlexLayoutModule,
    FormsModule
  ],
  providers: [ TempDataService ],
declarations: [ ModuleOperationsComponent,ModuleOperationsFilterPipe],
})
export class ModuleOperationsModule { 
  
}
