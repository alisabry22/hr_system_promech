import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent {
  @Input ()collapsed=false;
  @Input () screenWidth=0;

  getBodyClass():String{
    let StyleClass='';
    if(this.collapsed && this.screenWidth>768){
      StyleClass='body-trimmed';

    }else if(this.collapsed && this.screenWidth<=768&&this.screenWidth>0){
      StyleClass='body-mid-screen';

    }
    return StyleClass;
  }
}
