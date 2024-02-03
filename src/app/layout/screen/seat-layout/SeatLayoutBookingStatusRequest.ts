import { Header } from '../../../shared/services/header';

export class SeatLayoutBookingStatusRequest
{
    header: Header;
    seatIds: seats[];
    constructor(){   
    }
}

export class seats
{
    bookingStatus : String;
    seatId: number;
    constructor(){   
    }
}

