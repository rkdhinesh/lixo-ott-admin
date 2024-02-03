import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LixoDataTableComponent } from './lixo-data-table.component';
import { MaterialModule } from '../../components/MaterialModule';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LixoDataTableComponent],
  exports: [LixoDataTableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule
  ]
})
export class LixoDataTableModule { }
