import { SubModule } from './sub-module';

export class Module {

    moduleId: string;
    moduleName: string;
    moduleDescription: string;
    moduleIconName:string;
    moduleRouterLink:string;
    subNavHide:boolean = true;
    subModules: SubModule[];

    constructor() {

    }


}
