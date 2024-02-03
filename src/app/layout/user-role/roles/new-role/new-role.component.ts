import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {

  
  title: String;
  names: any;
  selectedAll: any;
  constructor() { }

  ngOnInit() {this.title = "Select all/Deselect all checkbox - Angular 2";
  this.names = [
    { name: 'View', selected: false },
    { name: 'Add', selected: false },
    { name: 'Edit', selected: false },
    { name: 'Delete', selected: false },
  ]

}
selectAll() {
  for (var i = 0; i < this.names.length; i++) {
    this.names[i].selected = this.selectedAll;
  }
}
checkIfAllSelected() {
  this.selectedAll = this.names.every(function(item:any) {
      return item.selected == true;
    })
}
  }


