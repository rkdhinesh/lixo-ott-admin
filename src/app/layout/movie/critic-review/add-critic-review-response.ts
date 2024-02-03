import { Header } from '../../../shared/services/header';

export class AddCriticReviewResponse {
    comments: string;
    criticName: string;
    header: Header;
    movieId: number;
    rating: number;
    title: string;
    reviewDate: string;
    userId: string;
    constructor(
        comments: string,
        criticName: string,
        movieId: number,
        rating: number,
        title: string,
        reviewDate: string,
        userId: string,
    ) {
        this.comments = comments;
        this.criticName = criticName;
        this.movieId = movieId;
        this.rating = rating;
        this.title = title;
        this.reviewDate = reviewDate;
        this.userId = userId;
    }
}



