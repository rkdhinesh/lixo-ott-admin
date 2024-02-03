import { SeatLayoutModel } from "./seat-layout-model";
import { ColumnModel } from "./column-model";
import { Header } from "../services/header";
import { DropDownModel } from "../../layout/screen/add/add-screen.component";


export class ClassModel {
    classId:number;
    className:string;
    synopsis:string = "";
    seats:SeatLayoutModel[];
    screenId:number;
    classAlphabets:string[] = [];
    header:Header;
    columnsList:ColumnModel[] = [];
    rowRefList:ColumnModel[] = [];
    fareId:number;
    selectedFare : DropDownModel;
    fareList :DropDownModel[] = [];
    fareAmount:string="";
    constructor(){

    }
}
