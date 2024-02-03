import { Header } from "../../shared/services/header";

export class Review {
    experienceId: number;
    experienceName: string;
    experienceDesc: string;
    
    header:Header;
    editable:boolean;


constructor(
    experienceId: number,
    experienceName: string,
    experienceDesc: string
    ){
        this.experienceId = experienceId;
        this.experienceName = experienceName;
        this.experienceDesc = experienceDesc;
     }

}