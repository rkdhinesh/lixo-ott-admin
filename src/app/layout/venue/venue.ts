import { Header } from "../../shared/services/header";
import { VenueCategory } from "./venue-category";
import { Locality } from "./locality";
import { Company } from '../company/company';

export class Venue {
        active: number;
        companyId: number;
        venueId: number;
        venueName: string;
        localityId: number;
        venueCategoryId: number;
        landMark: string;
        synopsis: string;
        latitude: string;
        longitude: string;
        addressLine1: string;
        addressLine2: string;
        defaultDaysToPublish: String;
        additionalFare3d: number;
        foodAndBreverageAvailable: number;
        mobileTicketAvailable: number;
        additionalFare3dBoolean: boolean;
        foodAndBreverageAvailableBoolean: boolean;
        mobileTicketAvailableBoolean: boolean;
        isNew: boolean;
        venueCategory: VenueCategory;
        locality: Locality;
        mobileTicket: number;
        foodAndBreverage: number;
        company: Company;

        companyRenderedFlag: boolean;
        live: boolean;
        header: Header;
        venueShowTermsFileId: number;
        venueShowTermsFlag: string;

        vendorPercentage: number;
        accountNumber: string;

        constructor(companyId: number, venueName: string,
                localityId: number, venueCategoryId: number,
                landMark: string, synopsis: string,
                latitude: string, longitude: string,
                addressLine1: string, addressLine2: string, venueShowTermsFileId: number, venueShowTermsFlag: string, vendorPercentage: number, accountNumber: string) {

                this.companyId = companyId;
                this.venueName = venueName;
                this.localityId = localityId;
                this.venueCategoryId = venueCategoryId;
                this.landMark = landMark;
                this.synopsis = synopsis;
                this.latitude = latitude;
                this.longitude = longitude;
                this.addressLine1 = addressLine1;
                this.addressLine2 = addressLine2;
                this.venueShowTermsFileId = venueShowTermsFileId;
                this.venueShowTermsFlag = venueShowTermsFlag;
                this.vendorPercentage = vendorPercentage;
                this.accountNumber = accountNumber;
        }
}
