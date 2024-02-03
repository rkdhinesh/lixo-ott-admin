import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddModuleOperationsComponent } from './add-module-operations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../../shared';
import { MaterialModule } from '../../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddModuleOperationsRoutingModule } from './add-module-operations-routing.module';
import { OperationDialogComponent } from '../operation-dialog/operation-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    AddModuleOperationsRoutingModule
  ],
  declarations: [AddModuleOperationsComponent,OperationDialogComponent],
  entryComponents: [OperationDialogComponent]
})
export class AddModuleOperationsModule { }
