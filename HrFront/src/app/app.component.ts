import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
interface SidenavToggle{
  screenWidth:number;
  collapsed:boolean;

}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public dialog: MatDialog) {}
  title = 'sidenav';
isSideNavCollapsed=false;
screenWidth=0;
onToggleSideNav(data:SidenavToggle):void{
    this.screenWidth=data.screenWidth;
    this.isSideNavCollapsed=data.collapsed;
  }
}
