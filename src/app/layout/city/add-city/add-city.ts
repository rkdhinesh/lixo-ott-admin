import { Header } from '../../../shared/services/header';

export class AddCity {
    city_id: string;
    city: string;
    country: string;
    state: string;
    image_icon: string;
    popular_city: boolean;
    zone_id: number;
    header: Header;
    editable:boolean;

    constructor(
        city_id: string,
        city: string,
        country: string,
        state: string,
        image_icon: string,
        popular_city: boolean,zone_id: number,) {
            this.city_id = city_id;
        this.city = city;
        this.country = country;
        this.state = state;
        this.image_icon = image_icon;
        this.popular_city = popular_city;
        this.zone_id = zone_id;

    }
}
