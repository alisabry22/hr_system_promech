import { Component,EventEmitter, HostListener, OnInit} from '@angular/core';
import { navbarData } from './nav-data';

import { Output } from '@angular/core';
import { INavbarData } from './helper';
import { Router } from '@angular/router';
interface SidenavToggle{
  screenWidth:number;
  collapsed:boolean;

}
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {


  ngOnInit(): void {
    this.screenWidth=window.innerWidth;

  }

  @Output() onToggleSideNav:EventEmitter<SidenavToggle>=new EventEmitter();
collapsed=false;
navData=navbarData;
screenWidth=0;
multiple:boolean=false;

@HostListener ('window:resize',['$event'])
onResize(event:any){
  this.screenWidth=window.innerWidth;
  if(this.screenWidth<=768){
    this.collapsed=false;
  }
}

constructor(public router:Router){}
closeSidenav():void{
  this.collapsed=false;
  this.onToggleSideNav.emit({collapsed:this.collapsed,screenWidth:this.screenWidth});

}
toggleCollapse():void{

  this.collapsed=!this.collapsed;
  this.onToggleSideNav.emit({collapsed:this.collapsed,screenWidth:this.screenWidth});

}

handleClick(item:INavbarData):void{
  if(!this.multiple){
    for(let modelItem of this.navData){
      if(item!=modelItem && modelItem.expanded){
        modelItem.expanded=false;
        console.log(modelItem.expanded);
      }
    }
  }
  item.expanded=!item.expanded;
}

getActiveClass(item:INavbarData):string{
return this.router.url.includes(item.routeLink)?'active':'';
}

}
