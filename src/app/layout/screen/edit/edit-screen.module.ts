import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditScreenComponent } from './edit-screen.component';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { EditScreenRoutingModule } from './edit-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    EditScreenRoutingModule,
    FlexLayoutModule,
    FormsModule
  ],
  declarations: [EditScreenComponent]
})
export class EditScreenModule { }
