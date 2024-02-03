import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { LayoutRoutingModule } from "./layout-routing.module";
import { LayoutComponent } from "./layout.component";
import { HeaderComponent, SidebarComponent } from "../shared";
import { MaterialModule } from "../shared/components/MaterialModule";
import { YesOrNoDialogComponent } from "../shared/components/YesOrNoDialogs/YesOrNoDialogComponent";
import { SideNavService } from "../shared/services/side-nav.service";
import { FooterComponent } from "../shared/components/footer/footer.component";
import { NavbarComponent } from "../shared/components/navbar/navbar.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LayoutRoutingModule,
    TranslateModule,
    MaterialModule
  ],
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    YesOrNoDialogComponent,

  ],
  providers: [SideNavService],
  entryComponents: [YesOrNoDialogComponent]
})
export class LayoutModule { }
