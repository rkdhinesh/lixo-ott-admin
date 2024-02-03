import { Header } from '../../shared/services/header';

export class Genre {
    genreId: number;
      genreName: string;
      description: string;
      header:Header;
      editable:boolean;
  
  
  constructor(
    genreId: number,
    genreName:string,
    description: string){
          this.genreId = genreId;
          this.genreName = genreName;
          this.description = description;
  
  }
  
  
  }