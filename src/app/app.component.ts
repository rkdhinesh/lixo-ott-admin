import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RestService } from './api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers:[RestService]
})
export class AppComponent {

    constructor(private translate: TranslateService) {
        this.translate.addLangs(['en', 'fr', 'ur']);
        this.translate.setDefaultLang('en');

        const browserLang = translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur/) ? browserLang : 'en');
    }

}

