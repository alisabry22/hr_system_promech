import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job-service';
import { job } from 'shared/models/job';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddJobComponent } from '../add-job/add-job.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit{
  addJob:boolean=false;
  state:string="";
  message:string="";
  jobname:string="";
  alertShown:boolean=false;
  jobs=[];
  final_jobs:job[]=[];
  filter_text:string="";

  constructor(private jobservice:JobService,private dialog:MatDialog,private router:Router){

  }
  ngOnInit(): void {
    this.getAllJobs();
  }

  getAllJobs(){
    this.jobservice.getAllJobs().subscribe({
      next:(event)=>{
        if(event instanceof HttpErrorResponse ){
          this.state="error";
          this.message=event.message;
          this.alertShown=true;
        }else{
          this.jobs=event.alljobs;
          this.final_jobs=this.jobs.map(val=>({job_id:val[0],job_desc:val[1],total_emp:val[2]}));

        }


      },
      error:(event:any)=>{
        if(event instanceof HttpErrorResponse && event.status==403){
          this.router.navigate(["login"]);
        }
      }
    })
  }

  AddJob(){

    return this.jobservice.addNewJob(this.jobname).subscribe({
      next:(event:any)=>{
        console.log(event);

          this.state=event.state;
          this.message=event.message;
          this.alertShown=true;

          if(this.state=="success"){
            this.ngOnInit();
          }



      }

    });
  }
  OpenAddJobDialog(){
    console.log("called");

    const dialogConfig=new MatDialogConfig();
    dialogConfig.hasBackdrop=true;
    dialogConfig.autoFocus=true;
    dialogConfig.width="300px";
    dialogConfig.height="250px";


    dialogConfig.data={
      id:1,
      title:"Job Name"
    };

 const dialogRef=   this.dialog.open(AddJobComponent,dialogConfig);

 dialogRef.afterClosed().subscribe( (data)=>{

  this.jobname=data;
  if(this.jobname&&this.jobname.length>=1){
    this.AddJob();
  }
});
  }

  closeAlert(){
    this.alertShown=false;
  }

}
