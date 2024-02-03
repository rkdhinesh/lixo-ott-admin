import { PublishClassSummaryRequest } from "./publishclasssummaryrequest";
import { PublishShowSummaryRequest } from "./publishshowsummaryrequest";
import { PublishShowRequest } from "./publishshowrequest";
import { Header } from "../../shared/services/header";

export class Publish {
        bookingOpeningDate: string;
        classSummaryPublished: Array<PublishClassSummaryRequest>;
        companyId: number;
        fromDate: string;
        header: Header;
        screenId: number;
        showSummaryPublished: Array<PublishShowSummaryRequest>;
        showsCanceled: number;
        showsPublished: Array<PublishShowRequest>;
        toDate: string;
        venueId: number;
        AutoCompnumber;
        lastPublishedDate: string;

        constructor(bookingOpeningDate: string,
                companyId: number,
                fromDate: string,
                screenId: number,
                toDate: string,
                venueId: number,
                classSummaryPublished: Array<PublishClassSummaryRequest>,
                showSummaryPublished: Array<PublishShowSummaryRequest>,
                showsPublished: Array<PublishShowRequest>

        ) {
                this.bookingOpeningDate = bookingOpeningDate;
                this.companyId = companyId;
                this.fromDate = fromDate;
                this.screenId = screenId;
                this.toDate = toDate;
                this.venueId = venueId;
                this.classSummaryPublished = classSummaryPublished;
                this.showSummaryPublished = showSummaryPublished;
                this.showsPublished = showsPublished;

        }
}
