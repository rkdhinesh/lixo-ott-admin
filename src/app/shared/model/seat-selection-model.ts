import { Header } from '../services/header';

export class SeatStatusRequest {
    header: Header;
    venueId: string;
    seat_layout: SeatStatus;
    userId: string;
    constructor() {

    }
}

export class SeatStatus {
    classes: SeatClass[];
    constructor(classes: any) {
        this.classes = classes;
    }
}

export class SeatClass {
    classPublishedId: number;
    seats: SelectedSeats[];
    constructor(classPublishedId: number, labels: Array<any>) {
        this.classPublishedId = classPublishedId;
        this.seats = labels;

    }
}

export class SelectedSeats {
    bookingStatus: string;
    coordinateX: string;
    coordinateY: string;
    seat: Boolean;
    seatId: number;
    seatInt: string;
    seatNumber: string;
    seatsPublishedId: number;
}
