import { Header } from '../../shared/services/header';

export class BoxOffice {
    userId: string;
    roleId: string;
    companyId: string;
    systemId: string;
    primaryEmail: string;
    primaryPhoneNumber: string;
    venueDetails: any;
    header: Header;
    constructor(userId: string,
        roleId: string,
        companyId: string,
        systemId: string,
        primaryEmail: string,
        primaryPhoneNumber: string,
        venueDetails: any,
    ) {
        this.userId = userId;
        this.roleId = roleId;
        this.companyId = companyId;
        this.systemId = systemId;
        this.primaryEmail = primaryEmail;
        this.primaryPhoneNumber = primaryPhoneNumber;
        this.venueDetails = venueDetails;
    }
}
