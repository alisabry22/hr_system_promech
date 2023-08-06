import { Component, OnInit } from '@angular/core';
import { TimerepoService } from '../services/timerepo.service';
import { EmpTimeReport } from 'shared/models/emp_time_report';

@Component({
  selector: 'app-time-report',
  templateUrl: './time-report.component.html',
  styleUrls: ['./time-report.component.css']
})
export class TimeReportComponent implements OnInit{
  showLoading:boolean=true;
  filter_text:string ="";
  get_time_repo_data=[];
  pagination: number = 1;
  timeRepoData:EmpTimeReport[]=[];
  ngOnInit(): void {
    this.getAllTimeReports();
  }
  constructor(private timeRepoService:TimerepoService){

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
      }))
    })
    this.showLoading=false;
  }

  renderPage(event: number) {
    this.pagination = event;
    this.getAllTimeReports();
  }

}
