import { Header } from '../../../shared/services/header';

export class AddMovieMapping {
    cineastId: number;
    roleId: number;
    movieId: number;
    displayOrder: number;
    header: Header;

    constructor(
        cineastId: number,
        roleId: number,
        movieId: number,
        displayOrder: number,

    ) {
        this.cineastId = cineastId;
        this.roleId = roleId;
        this.movieId = movieId;
        this.displayOrder = displayOrder;
    }
}
