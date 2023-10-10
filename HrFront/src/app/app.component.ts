import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from './services/login.service';
import { Observable } from 'rxjs';
interface SidenavToggle{
  screenWidth:number;
  collapsed:boolean;

}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  constructor(public dialog: MatDialog,private loginService:LoginService) {}
  ngOnInit(): void {
    this.isLoggedIn$ = this.loginService.isLoggedIn;


    // window.onbeforeunload=function(){
    //   localStorage.clear();
    //   return '';
    // }
  }
  title = 'sidenav';
isSideNavCollapsed=false;
screenWidth=0;
onToggleSideNav(data:SidenavToggle):void{
    this.screenWidth=data.screenWidth;
    this.isSideNavCollapsed=data.collapsed;
  }
}
