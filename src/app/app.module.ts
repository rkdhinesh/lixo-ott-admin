import { BrowserModule } from "@angular/platform-browser";
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { HttpModule, Http } from "@angular/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./shared";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./shared/components/MaterialModule";
import { TokenStorage } from "./shared/guard/token-storage";
import { httpInterceptorProviders } from "./shared/http-interceptors";
import { DatePipe, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { RestService } from "./api.service";
import { LogService } from "./shared/services/log.service";
import { ScreenAccessService } from "./shared/services/screen-access.service";
import { Data } from "./shared/data";
import { ENDPOINTS_CONFIG, EndpointsConfig } from "./configs/endpoints.config";
import { ResetPasswordModule } from "./layout/reset-password/reset-password.module";
import { ViewmodalComponent } from './viewmodal/viewmodal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from "ngx-toastr";
import { BlankPageComponent } from "./layout/blank-page/blank-page.component";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "/assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, ViewmodalComponent,BlankPageComponent],
  entryComponents: [ViewmodalComponent,BlankPageComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ResetPasswordModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    MatDialogModule,
    ToastrModule.forRoot({
      timeOut: 15000,
      positionClass: 'toast-bottom-full-width',
      preventDuplicates: true,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthGuard,
    TokenStorage,
    LogService,
    RestService,
    ScreenAccessService,
    Data,
    httpInterceptorProviders,
    DatePipe,
    { provide: ENDPOINTS_CONFIG, useValue: EndpointsConfig },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
