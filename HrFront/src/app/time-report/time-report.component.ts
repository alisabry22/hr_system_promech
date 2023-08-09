import { Component, OnInit } from '@angular/core';
import { TimerepoService } from '../services/timerepo.service';
import { EmpTimeReport } from 'shared/models/emp_time_report';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-time-report',
  templateUrl: './time-report.component.html',
  providers:[DatePipe],
  styleUrls: ['./time-report.component.css']
})
export class TimeReportComponent implements OnInit{
  showLoading:boolean=true;
  filter_text:string ="";
  get_time_repo_data=[];
  pagination: number = 1;
  timeRepoData:EmpTimeReport[]=[];
  db:string='';
  startDate:string='';
  endDate:string='';
  file_name:string=`${this.datepipe.transform((new Date()),"MM-dd-yyyy h:mm")}_reports.xlsx`;

  range=new FormGroup({ 
    start:new FormControl<Date|null>(null),
    end:new FormControl<Date|null>(null),
  })



  ngOnInit(): void {
    this.getAllTimeReports();
  }
  constructor(private timeRepoService:TimerepoService,public datepipe:DatePipe){
   
    console.log(this.startDate,this.endDate);
  }

  getAllTimeReports(){
    this.showLoading=true;
    this.timeRepoService.getAllTimeReportData().subscribe(response=>{
      this.get_time_repo_data=response.timerepo;
    
      this.timeRepoData=this.get_time_repo_data.map(val=>({
        cardId:val["card_id"],
        company_name:val["company_name"],
        emp_name:val["emp_name"],
        month:val["month"],
        year:val["year"],
        rule_no:val["rule_no"],
        total_absent:val["t_absent"],
        total_attend:val["t_attend"],
        total_casual_vacation:val["t_casual_vacation"],
        total_late:val["t_late"],
        total_mission:val["t_mission"],
        total_oridinary_vacation:val["t_oridinary_vacation"],
        total_sick:val["t_sick"],
        trans_amount:val["trans_amount"],
        total_permission:val["t_permission"],
      }))
    })
    this.showLoading=false;
  }

  renderPage(event: number) {
    this.pagination = event;
    this.getAllTimeReports();
  }
  startDateChange(event:MatDatepickerInputEvent<Date>){
      if(event.value){
        this.startDate=`${(event.value?.getMonth()+1)}-${event.value?.getFullYear()}`;

      }
 
  

  }
  endDateChange(event:MatDatepickerInputEvent<Date>){
    if(event.value){
      this.endDate=`${(event.value?.getMonth()+1)}-${event.value?.getFullYear()}`;
  
    }
    
  }
  exportToExcel():void{
  

      
    let element=document.getElementById('table');
    console.log(element);
    
    const ws:XLSX.WorkSheet=XLSX.utils.table_to_sheet(element);
    const wb:XLSX.WorkBook=XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb,ws,"report");
    XLSX.writeFile(wb,this.file_name);


  }

  

}
