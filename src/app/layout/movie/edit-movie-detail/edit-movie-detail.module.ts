import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { EditMovieDetailRoutingModule } from './edit-movie-detail.routing.module';
import { EditMovieDetailComponent } from './edit-movie-detail.component';

@NgModule({
  imports: [
    CommonModule,
    EditMovieDetailRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [TempDataService],
  declarations: [EditMovieDetailComponent]
})
export class EditMovieDetailModule { }
