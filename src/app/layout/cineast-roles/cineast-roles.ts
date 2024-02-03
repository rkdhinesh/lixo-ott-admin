import { Header } from '../../shared/services/header';

export class CineastRoles {
    roleId: number;
    roleName: string;
    roleDescription: string;
    roleType: string;
    header: Header;
    constructor(
        roleId: number,
        roleName: string,
        roleDescription: string,
        roleType: string,


    ) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.roleType = roleType;


    }
}


