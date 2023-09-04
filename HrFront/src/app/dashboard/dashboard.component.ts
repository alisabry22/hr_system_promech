import { Component, OnInit } from '@angular/core';
import { DashboardServicesService } from '../services/dashboard-services.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { HttperrorComponent } from '../httperror/httperror.component';
import { Employee } from 'shared/models/employee';
import { SectionModel } from 'shared/models/section';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  totalemp:number=0;
  totaldept:number=0;
  totaljobs:number=0;
  latest_emps:Employee[]=[];
  state:string="";
  message:string="";
  totalsects:number=0;
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
          
          if (event instanceof HttpErrorResponse){
            this.state="error";
            this.message=event.message;
            this.alertShown=true;
           
          }else{
      
    
            this.state=event.state;
            this.totalemp=event.totalemp;
            this.totaldept=event.totaldept;
            this.totaljobs=event.totaljob;
            this.totalsects=event.totalsect;
            console.log(this.totalsects);
            
          this.latest_emps=event.latest_emps.map((val:any)=>({card_id:val["card_id"],employee_name:val["emp_name"],hire_date:val["hire_date"],department_name:val["dept_desc"]}))
     
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
