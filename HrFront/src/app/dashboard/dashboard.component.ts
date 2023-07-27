import { Component, OnInit } from '@angular/core';
import { DashboardServicesService } from '../services/dashboard-services.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { HttperrorComponent } from '../httperror/httperror.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  totalemp:number=0;
  totaldept:number=0;
  state:string="";
  message:string="";
  alertShown:boolean=false;
  ngOnInit(): void {
    this.getDashboardData();
  }
  constructor(private dashboardServices :DashboardServicesService,public dialog: MatDialog){}

  getDashboardData(){

      return this.dashboardServices.getAllDashboardData().subscribe(
        // (response)=>{console.log(response)},
        // (error)=>{console.log(error)},
        {

        next:(event:any)=>{
          console.log(event);
          if (event instanceof HttpErrorResponse){
            this.state="error";
            this.message=event.message;
            this.alertShown=true;
            console.log(event);
          }else{
            this.state=event.state;
            this.totalemp=event.totalemp;
            this.totaldept=event.totaldept;
          }

        },
        error:(event:any)=>{
       this.openDialog();
        }


      }
      );


  }

  openDialog(){
    this.dialog.open(HttperrorComponent);
  }

  closeAlert(){
    this.alertShown=false;
  }

}
