import { Header } from '../../shared/services/header';

export class MovieMappingDetails {
    movieId: number;
    cineastId: number;
    roleId: number;
    displayOrder: number;
    header: Header;
    constructor(cineastId: number,
        movieId: number,
        roleId: number,
        displayOrder: number,
    ) {
        cineastId = cineastId;

        roleId = roleId;
        movieId = movieId
        displayOrder = displayOrder;

    }
}
