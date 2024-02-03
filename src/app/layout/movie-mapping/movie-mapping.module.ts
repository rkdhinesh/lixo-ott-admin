import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieMappingComponent } from './movie-mapping.component';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { MovieMappingRoutingModule } from './movie-mapping-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from '../../shared/temp-dataStore';

@NgModule({
  declarations: [MovieMappingComponent],
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    MovieMappingRoutingModule,
    FlexLayoutModule,
    FormsModule,

  ],
  providers: [TempDataService],
})
export class MovieMappingModule { }
