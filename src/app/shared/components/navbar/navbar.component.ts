import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ScreenAccessService } from '../../services/screen-access.service';
import { LogService } from '../../services/log.service';
import { TokenStorage } from '../../guard/token-storage';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    public listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;

    flag: boolean;

    constructor(location: Location, private element: ElementRef, private log: LogService,
        private router: Router, private screenAccess: ScreenAccessService, private token: TokenStorage) {
        this.location = location;
        this.sidebarVisible = false;
    }

    applyBodyStyle() {
        this.flag = true;
        if (this.flag) {
            document.getElementsByTagName('body')[0].className = 'sidebar-mini';
        } else {
            document.getElementsByTagName('body')[0].className = '';
            this.flag = false;
        }

    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            console.log(event);
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });

    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('sidebar-mini');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('sidebar-mini');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        //titlee = titlee.split('/').pop();

        //   for(var item = 0; item < this.listTitles.length; item++){
        //       if(this.listTitles[item].path === titlee){
        //           return this.listTitles[item].title;
        //       }
        //   }
        if ('/layout' == titlee) {
            return '';
        } else {
            this.screenAccess.getAllSubModules();
            let map = this.screenAccess.subModuleMap;
            this.log.info(map.get(titlee))
            return map.get(titlee);
        }

    }
    logout() {
        this.log.info("Log out method called..")
        this.router.navigate(['/']);
        localStorage.removeItem("userId");
        this.token.signOut();

    }
    ResetPassword() {
        this.log.info("Forwarding to password reset")
        this.router.navigate(['/reset-password']);
    }
}
