import { Header } from "../services/header";
import { ClassModel } from "./class-model";

export class ScreenModel {
    
    venueId:number;
    active:number;
    screenId:number;
    screenName:string;
    synopsis:string;
    dimension:string;
    defaultShowTimes:string[];
    header:Header;
    live:boolean;
    experienceId:number;
    rowCount:number;
    rowType:String;
    rowOrder:string;    
    columnCount:number;
    columnOrder:string;
    classCount:number;
    classes:ClassModel[];
    rows:number[] = [];
    columns:number[]=[];
    constructor(){

        
    }

}
