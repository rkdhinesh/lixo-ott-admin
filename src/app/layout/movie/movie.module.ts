import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from '../../shared/temp-dataStore';
import { MovieRoutingModule } from './movie-routing.module';
import { EditMovieModule } from './edit-movie/edit-movie.module';
import { MovieComponent } from './movie.component';
import { FilterPipe } from './movie.pipes';
import { DatePickerModule } from '../../shared/modules/date-picker/date-picker.module';
import { ViewMovieModule } from './view-movie/view-movie.module';
import { CriticReviewComponent } from './critic-review/critic-review.component';
import { EditCriticReviewModule } from './critic-review/edit-critic-review/edit-critic-review.module';
import { EditCriticReviewComponent } from './critic-review/edit-critic-review/edit-critic-review.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddMovieDetailModule } from './add-movie-detail/add-movie-detail.module';
import { ViewMovieDetailModule } from './view-movie-detail/view-movie-detail.module';
import { MovieDetailModule } from './movie-detail/movie-detail.module';
import { EditMovieDetailComponent } from './edit-movie-detail/edit-movie-detail.component';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    MovieRoutingModule,
    EditMovieModule,
    ViewMovieModule,
    FlexLayoutModule,
    FormsModule,
    DatePickerModule,
    EditCriticReviewModule,
    MatFormFieldModule,
    AddMovieDetailModule,
    ViewMovieDetailModule,
    MovieDetailModule
  ],
  entryComponents: [CriticReviewComponent, EditCriticReviewComponent],
  providers: [TempDataService],
  declarations: [MovieComponent, FilterPipe, CriticReviewComponent],
})
export class MovieModule { }
