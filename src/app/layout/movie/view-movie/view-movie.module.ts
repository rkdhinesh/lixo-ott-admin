import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMovieRoutingModule } from './view-movie-routing.module';
import { ViewMovieComponent } from './view-movie.component';
import { TempDataService } from '../../../shared/temp-dataStore';
import { ViewMovieFilterPipe } from './view-movie.pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EditCriticReviewModule } from '../critic-review/edit-critic-review/edit-critic-review.module';

@NgModule({
  imports: [

    CommonModule,
    ViewMovieRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatDialogModule,
    EditCriticReviewModule,
    MatFormFieldModule

  ],
  // entryComponents: [CriticReviewComponent, EditCriticReviewComponent],

  providers: [TempDataService],
  declarations: [ViewMovieComponent, ViewMovieFilterPipe]

})
export class ViewMovieModule { }
