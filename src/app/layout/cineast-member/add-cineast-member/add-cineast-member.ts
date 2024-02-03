import { Header } from '../../../shared/services/header';

export class AddCineastMember {
    cineastName: string;
    profileImage: string;
    header: Header;

    constructor(
        cineastName: string,
        profileImage: string,

    ) {
        this.cineastName = cineastName;
        this.profileImage = profileImage;
    }
}
