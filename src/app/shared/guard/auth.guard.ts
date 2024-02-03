import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { GeolocationService } from '../../geolocation/geolocation.service'
import { MatDialog } from '@angular/material/dialog';
import { BlankPageComponent } from '../../layout/blank-page/blank-page.component';

@Injectable()
export class AuthGuard implements CanActivate {
    currentIpAddress: string = '';
    countryCode: string = '';
    isVpn: boolean;
    userAccess: boolean;
    isCCIndia: boolean;
    startIp: string[] = [];
    endIp: string[] = [];
    dialogRef: any;
    isLoading: boolean = false;

    constructor(
        private router: Router,
         private http: HttpClient,
          private geolocationService: GeolocationService,
          private matDialog: MatDialog) { }

    async canActivate() {
      this.dialogRef = this.matDialog.open(BlankPageComponent)
        this.isLoading = true;
        const response: string = await this.http.get('https://www.cloudflare.com/cdn-cgi/trace', { responseType: 'text' }).toPromise();
        const responseArray: string[] = response.split('\n');
        this.currentIpAddress = responseArray[2].replace('ip=', '');
        this.countryCode = responseArray[9].replace('loc=', '');
        if (this.countryCode === 'IN') {
            if (localStorage.getItem('lastIpAddress') === this.currentIpAddress) {
                console.log("EXISTING")
                this.userAccess = true;
                this.isVpn = false;
                this.isCCIndia = true;
                //   this.geolocationService.checkConnection(true,false);
                return true;
            }
            else {
                // this.dialogRef = this.matDialog.open(BlankPageComponent)
                console.log("PROXY METHOD")
                const response: any = await this.http.get(`https://api.incolumitas.com/?q=${this.currentIpAddress}`).toPromise();
                if(response.is_datacenter || response.is_proxy || response.is_vpn) {
                  this.geolocationService.checkConnection(true, true, this.currentIpAddress, this.countryCode);
                    this.dialogRef.close();
                    this.router.navigate(['/geo-location']);
                    return false;
                }
                else {
                  localStorage.setItem('lastIpAddress', this.currentIpAddress);
                    // this.storeDataInIndexedDB(this.currentIpAddress);
                    this.dialogRef.close();
                    return true
                }
                // const startIpAddress: string = await this.http.get('https://ipaddress.free.beeceptor.com', { responseType: 'text' }).toPromise();
                // this.startIp = startIpAddress.split('\n');
                // const endIpAddress: string = await this.http.get('https://endapi.free.beeceptor.com', { responseType: 'text' }).toPromise();
                // this.endIp = endIpAddress.split('\n');
                // if(this.ipInRanges(this.currentIpAddress, this.startIp, this.endIp)) {
                //     this.geolocationService.checkConnection(true, true, this.currentIpAddress, this.countryCode);
                //     this.dialogRef.close();
                //     this.router.navigate(['/geo-location']);
                //     return false;
                // }
                // if(!this.ipInRanges(this.currentIpAddress, this.startIp, this.endIp)) {
                //     localStorage.setItem('lastIpAddress', this.currentIpAddress);
                //     this.storeDataInIndexedDB(this.currentIpAddress);
                //     this.dialogRef.close();
                //     return true
                // }
                // const response: any = await this.http.get(`https://proxycheck.io/v2/${this.currentIpAddress}?vpn=1`).toPromise();
                // if (response[this.currentIpAddress].proxy === 'yes') {
                //     this.isVpn = true;
                //     this.userAccess = false;
                //     this.isCCIndia = true
                //     this.geolocationService.checkConnection(true, true, this.currentIpAddress, this.countryCode);
                //     this.router.navigate(['/geo-location']);
                //     return false;
                // }
                // if (response[this.currentIpAddress].proxy === 'no') {
                //     this.isVpn = false;
                //     this.userAccess = true;
                //     this.isCCIndia = true;
                //     // this.geolocationService.checkConnection(true,false);
                //     localStorage.setItem('lastIpAddress', this.currentIpAddress)
                //     return true
                // }
            }
        }
        else {
            this.userAccess = false;
            this.isVpn = true;
            this.isCCIndia = false;
            this.dialogRef.close();
            this.geolocationService.checkConnection(false, true, this.currentIpAddress, this.countryCode);
            this.router.navigate(['/geo-location']);
            return false;
        }
        //   this.cdr.detectChanges();
        // if (localStorage.getItem('isLoggedin')) {
        //     return true;
        // }

        // this.router.navigate(['']);
        // return false;
    }

    // ipInRanges(ip: string, startIps: string[], endIps: string[]): boolean {
    //     return startIps.some((startIp, index) => {
    //         const endIp = endIps[index];
    //         return this.ipInRange(ip, startIp, endIp);
    //     });
    // }

    // private ipInRange(ip: string, startIp: string, endIp: string): boolean {
    //     const ipToInt = (ipAddress: string): number => ipAddress.split('.').reduce((acc, val) => (acc << 8) + parseInt(val, 10), 0);
    //     const startInt = ipToInt(startIp);
    //     const endInt = ipToInt(endIp);
    //     const ipInt = ipToInt(ip);
    //     return startInt <= ipInt && ipInt <= endInt;
    // }

    // storeDataInIndexedDB(data: any): void {
    //   console.log(data)
    //     // Open IndexedDB database
    //     const request = window.indexedDB.open('lastIpAddress-db', 1);
    
    //     request.onerror = (event) => {
    //       console.error('IndexedDB error:', (event.target as IDBRequest).error);
    //     };
    
    //     request.onsuccess = (event) => {
    //       const db = (event.target as IDBRequest).result;
    //       const transaction = db.transaction(['lastIpAddress-store'], 'readwrite');
    //       const objectStore = transaction.objectStore('lastIpAddress-store');
    
    //       const addDataRequest = objectStore.add(data, 'lastIpAddress');
    
    //       addDataRequest.oncomplete = () => {
    //         console.log('Data stored in IndexedDB successfully.');
    //       };
    
    //       addDataRequest.onerror = (event) => {
    //         console.error('Transaction error:', (event.target as IDBRequest).error);
    //       };
    //     };
    
    //     request.onupgradeneeded = (event) => {
    //       const db = (event.target as IDBRequest).result;
    //       const objectStore = db.createObjectStore('lastIpAddress-store');
    //       // Define object store schema if needed
    //       // objectStore.createIndex('indexName', 'fieldName', { unique: false });
    //     };
    //   }

}
