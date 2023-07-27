import { Component, OnInit } from '@angular/core';
import { EmpTime } from 'shared/models/emptime';
import { GetemptimeService } from '../services/getemptime.service';
import { HttpResponse } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { EditemptimeComponent } from '../editemptime/editemptime.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Employee } from 'shared/models/employee';
@Component({
  selector: 'app-emptime',
  templateUrl: './emptime.component.html',
  styleUrls: ['./emptime.component.css']
})
export class EmptimeComponent implements OnInit {
  getemps=[];
  get_emps_time:EmpTime[]=[];
  showLoading:boolean=false;
  pagination:number=1;
  filter_text:string="";
    ngOnInit(): void {

      this.showLoading=true;
      console.log(this.showLoading);
      this.getAllEmpTime();
      this.showLoading=false;
      console.log(this.showLoading);

  }
  constructor(private empTimeService:GetemptimeService,private dialog:MatDialog){}


  getAllEmpTime(){
    this.empTimeService.getAllEmpTime().subscribe(response=>{

      this.getemps=response.emptime;
      this.get_emps_time=this.getemps.map(val=>({
        card_id:val["CARD_ID"],
      emp_name:val["EMP_NAME"],
      date_day:val["DATE_DAY"],
      clock_in:val["CLOCK_IN"],
      clock_out:val["CLOCK_OUT"],
      late:val["LATE"],
      early:val["EARLY"],
      absent_flag:val["ABSENT_FLAG"],
      remarks:val["REMARKS"],
      trans_amt:val["TRANS_AMT"],
      calc_flag:val["CALC_FLAG"],
      }));

    } );

  }

  renderPage(event:number){
    this.pagination=event;
    this.getAllEmpTime();
  }
  openDialog(emp:EmpTime){

    const dialogConfig=new MatDialogConfig();
    dialogConfig.hasBackdrop=true;
    dialogConfig.autoFocus=true;
    dialogConfig.width="40%";
    dialogConfig.height="70vh";

    dialogConfig.data=emp;

 const dialogRef=   this.dialog.open(EditemptimeComponent,dialogConfig);

 dialogRef.afterClosed().subscribe( (data)=>{
  console.log(data);
  }
);



    }


}
