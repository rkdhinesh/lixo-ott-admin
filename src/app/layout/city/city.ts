import { Header } from '../../shared/services/header';

export class City {
    city_id: string
    city: string;
    zone: string;
    state: string;
    country: string;
    zone_id: number;
    image_icon: string;
    popular_city: number;
    header:Header

    constructor(
        city_id: string,
        city: string,
        zone: string,
        state: string,
        country: string,
        zone_id: number,
        image_icon: string,
        popular_city: number) {
            this.city_id = city_id;
        this.city = city;
        this.zone = zone;
        this.state = state;
        this.country = country;
        this.zone_id = zone_id;
        this.image_icon = image_icon;
        this.popular_city = popular_city;

    }
}
