import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewGenreRoutingModule } from './view-genre-routing.module';
import { ViewGenreComponent } from './view-genre.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  imports: [
    CommonModule,
    ViewGenreRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [ TempDataService],
  declarations: [ViewGenreComponent]
})
export class ViewGenreModule { }
