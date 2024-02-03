import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { EditMovieRoutingModule } from './edit-movie-routing.module';
import { EditMovieComponent } from './edit-movie.component';
import { EditMovieFilterPipe } from './edit-movie.pipes';

@NgModule({
  imports: [
    CommonModule,
    EditMovieRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [TempDataService],
  declarations: [EditMovieComponent, EditMovieFilterPipe]
})
export class EditMovieModule { }
