import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService } from '../services/history.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl, FormGroup } from '@angular/forms';
import { EmpHistory } from 'shared/models/emphistory';

@Component({
  selector: 'app-historyemp',
  templateUrl: './historyemp.component.html',
  styleUrls: ['./historyemp.component.css']
})
export class HistoryempComponent implements OnInit {
  emps: EmpHistory[] = [];
  result = [];
  pagination: number = 1;
  state: string = "";
  temp_emps:EmpHistory[]=[];
  message: string = "";
  showLoading: boolean = false;
  alertShown: boolean = false;
  filter_text: string = "";
  startDate!:Date ;
  endDate!: Date;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })
  constructor(private router: Router, private historyService: HistoryService) { }
  ngOnInit(): void {
    this.pagination=1;
    this.range = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    })
    var token = sessionStorage.getItem("token");
    if (!token) {
      this.router.navigate(["login"]);
    } else {
      this.getAllEmpHistory();
    }
  }

  getAllEmpHistory() {
    this.showLoading = true;
    this.historyService.getAllEmpsHistory().subscribe({


      next: (event: any) => {


        this.result = event.history;


        this.emps = this.result.map(val => ({
          date_day: val[0],
          card_id: val[1],
          emp_name: val[2],
          company_name: val[3],
          rule_no: val[4],
          dept_code: val[5],
          sect_code: val[6],
          job_code: val[6],
          in_hour: val[8],
          IN_MIN: val[9],
          exit_hour: val[10],
          exit_min: val[11],
          late_hour: val[12],
          late_min: val[13],
          early_hour: val[14],
          early_min: val[15],
          trans_amt: val[17],
          remarks: val[18],
          absent: val[19],

        }))
      },
      error: (event: any) => {
        if (event instanceof HttpErrorResponse && event.status == 403) {
          this.router.navigate(["login"]);
        } else {
          this.alertShown = true;
          this.message = event.message;
          this.state = event.state;
        }
      }
    });
    this.showLoading = false;
  }
  closeAlert() {
    this.alertShown = false;
  }
  renderPage(event: number) {
    this.pagination = event;

  }
  startDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.startDate=event.value;

    //  this.startDate = `${event.value.getDate()}-${(event.value?.getMonth() + 1)}-${event.value?.getFullYear()}`;

    }







  };

   addOneDay(date = new Date()) {
    date.setDate(date.getDate() + 1);

    return date;
  }
  endDateChange(event: MatDatepickerInputEvent<Date>) {
    this.temp_emps=[];
    if (event.value) {


      this.endDate=this.addOneDay(event.value);



      for(let element of this.emps){
       var date=new Date(element.date_day);


        if(date<=this.endDate && date>=this.startDate){

          this.temp_emps.push(element);
        }

      }
      this.emps=this.temp_emps;



  }



}
applyCalled(event: any) {



}
resetFilters() {
  this.ngOnInit();
}

}
