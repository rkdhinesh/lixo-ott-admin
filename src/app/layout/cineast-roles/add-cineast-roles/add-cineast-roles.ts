import { Header } from 'app/shared/services/header';

export class AddCineastRole {
    roleDescription: string;
    roleName: string;
    roleType: string;
    header: Header;
    constructor(
        roleName: string,
        roleDescription: string,
        roleType: string

    ) {
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.roleType = roleType;
    }
}
