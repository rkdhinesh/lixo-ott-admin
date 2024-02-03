export class CineastDetails {
    // movieName: string;
    cineastId: number;
    cineastName: string;
    profileImage: any;
    roleId: number;
    roleName: string;
    roleType: string;
    roleDescription: string;
    displayOrder: number;
    constructor(
        // movieName: string,
        cineastId: number,
        cineastName: string,
        profileImage: any,
        roleId: number,
        roleName: string,
        roleType: string,
        roleDescription: string,
        displayOrder: number) {
        // this.movieName = movieName;
        this.cineastId = cineastId;
        this.cineastName = cineastName;
        this.profileImage = profileImage;
        this.roleId = roleId;
        this.roleName = roleName;
        this.roleType = roleType;
        this.roleDescription = roleDescription;
        this.displayOrder = displayOrder;
    }
}