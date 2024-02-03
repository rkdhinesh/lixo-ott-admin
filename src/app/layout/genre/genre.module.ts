import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenreComponent } from './genre.component';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { GenreRoutingModule } from './genre-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from '../../shared/temp-dataStore';
import { FilterPipe } from './genre.pipes';
import { EditGenreModule } from './edit-genre/edit-genre.module';
import { ViewGenreModule } from './view-genre/view-genre.module';

@NgModule({
  imports: [
        CommonModule,
        PageHeaderModule,
        MaterialModule,
        RouterModule,
        GenreRoutingModule,
        EditGenreModule, 
        ViewGenreModule,        
        FlexLayoutModule,
        FormsModule
    ],
    providers: [ TempDataService ],
    declarations: [ GenreComponent,FilterPipe],
})
export class GenreModule { }
