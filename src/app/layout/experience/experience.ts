import { Header } from '../../shared/services/header';

export class Experience {
      id: number;
      name: string;
      description: string;
      header:Header;
      editable:boolean;
  
  
  constructor(
    id: number,
    name:string,
    description: string){
          this.id = id;
          this.name = name;
          this.description = description;
  
  }
  
  
  }