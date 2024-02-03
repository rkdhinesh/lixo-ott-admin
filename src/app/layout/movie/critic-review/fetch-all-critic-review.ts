import { Header } from "../../../shared/services/header";


export class FetchCriticReview {
    reviewId: number;
    criticName: string;
    title: number;
    rating: string;
    comments: string;
    reviewDate: string;
    userId: string;
    movieId: number;
    header: Header;
    constructor(
        reviewId: number,
        criticName: string,
        title: number,
        rating: string,
        comments: string,
        reviewDate: string,
        userId: string,
        movieId: number,
    ) {
        this.reviewId = reviewId;
        this.criticName = criticName;
        this.title = title;
        this.rating = rating;
        this.comments = comments;
        this.movieId = movieId;
        this.reviewDate = reviewDate;
        this.userId = userId;
    }
}


