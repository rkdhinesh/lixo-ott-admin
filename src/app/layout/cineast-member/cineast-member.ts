import { Header } from 'app/shared/services/header';

export class CineastMember {
    cineastId: number;
    cineastName: string;
    profileImage: string;
    header: Header;
    constructor(
        cineastId: number,
        cineastName: string,
        profileImage: string,

    ) {
        this.cineastId = cineastId;
        this.cineastName = cineastName;
        this.profileImage = profileImage;
    }
}
