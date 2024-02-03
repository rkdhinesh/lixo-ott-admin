import { Header } from "../services/header";
import { ModuleOperaion } from "../../layout/user-role/module-operations/module-operations.component";


export class Role {

    roleId:string;
    roleName:string;
    roleDescription:string;
    roleType:string;
    system:string;
    client:string;

    header:Header;
    moduleList: ModuleOperaion[] = [];

    constructor(){

    }

    
}
