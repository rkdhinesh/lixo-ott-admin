import { Header } from "../services/header";
import { Operation } from "./operation";

export class ModuleOperations{
    
    moduleName:string;
    moduleDescription:string;
    subModuleName:string;
    subModuleDescription:string;
    operationName:string;
    operationDescription:string;
    moduleOperationList:Operation[];
    moduleId:string;
    system:string;
    client:string;
    header:Header;
    access: boolean = false;

    constructor(){

    }

    
}
