import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { AddMovieDetailRoutingModule } from './add-movie-detail-routing.module';
import { AddMovieDetailComponent } from './add-movie-detail.component';

@NgModule({
  imports: [
    CommonModule,
    AddMovieDetailRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [TempDataService],
  declarations: [AddMovieDetailComponent]
})
export class AddMovieDetailModule { }
