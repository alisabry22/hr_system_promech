import { Component, OnInit } from '@angular/core';
import { TimerepoService } from '../services/timerepo.service';
import { EmpTimeReport } from 'shared/models/emp_time_report';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { Department } from 'shared/models/department';
import { SectionModel } from 'shared/models/section';
import { Sort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-time-report',
  templateUrl: './time-report.component.html',
  providers: [DatePipe],
  styleUrls: ['./time-report.component.css']
})
export class TimeReportComponent implements OnInit {
  showLoading: boolean = true;
  filter_text: string = "";
  get_time_repo_data = [];
  pagination: number = 1;
  timeRepoData: EmpTimeReport[] = [];
  departments: Department[] = [];
  sections: SectionModel[] = [];
  get_depts = [];
  sortedData: EmpTimeReport[] = [];
  selectedDebt: string = "";
  resetoptions: string = "";
  resetSections: string = "";
  db: string = '';
  startDate: string = '';
  endDate: string = '';
  file_name: string = `${this.datepipe.transform((new Date()), "MM-dd-yyyy h:mm")}_reports.xlsx`;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })



  ngOnInit(): void {

    this.range = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    })
    this.selectedDebt = "";
    this.pagination=1;
    this.startDate = "";
    this.endDate = "";
    this.resetoptions = "";
    this.filter_text = "";
    this.resetSections = "";
    this.getAllTimeReports();
    this.getAllDepts();
  }
  constructor(private router:Router,private timeRepoService: TimerepoService, public datepipe: DatePipe) {

  }
  getAllDepts() {
    this.timeRepoService.getAllDepts().subscribe({
      next:(event:any)=>{
        this.get_depts = event.departments;
        var sect: [] = event.sects;
        this.sections = sect.map(val => ({ sect_code: val[0], sect_description: val[1] }));
        this.departments = this.get_depts.map(val => ({ dept_id: val[0], dept_desc: val[1] }));
      },
      error:(event:any)=>{
        if(event instanceof HttpErrorResponse && event.status==403){
          this.router.navigate(["login"]);
        }
      }



    })
  }


  getAllTimeReports() {
    this.showLoading = true;
    this.timeRepoData = [];

    this.timeRepoService.getAllTimeReportData().subscribe(response => {
      this.get_time_repo_data = response.timerepo;

      this.timeRepoData = this.get_time_repo_data.map(val => ({
        cardId: val[0],
        emp_name: val[2],
        month: val[4],
        year: val[5],
        total_late: val[6],
        total_attend: val[7],
        trans_amount: val[8],
        total_absent: val[9],
        total_sick: val[10],
        total_mission: val[11],
        total_oridinary_vacation: val[12],
        total_casual_vacation: val[13],
        total_permission: val[14],
        rule_no: val[15],
        company_name: val[16],
        dept_name: val[17],
        sect_desc: val[18]

      }))
      this.sortedData=this.timeRepoData;

    })
   this.showLoading = false;


  }

  renderPage(event: number) {
    this.pagination = event;
   // this.getAllTimeReports();
  }
  startDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.startDate = `${(event.value?.getMonth() + 1)}-${event.value?.getFullYear()}`;

    }







  }
  endDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.endDate = `${(event.value?.getMonth() + 1)}-${event.value?.getFullYear()}`;

      var startDateSplit = this.startDate.split("-");
      var endDateSplit = this.endDate.split("-");

      var emps = this.timeRepoData.filter((emp) => (((emp.month! >= parseInt(startDateSplit[0])) && (emp.year! >= parseInt(startDateSplit[1]))) && ((emp.month! <= parseInt(endDateSplit[0])) && (emp.year! <= parseInt(endDateSplit[1])))));

      var count = this.timeRepoService.getDifferenceInMonths(this.startDate, this.endDate);
      this.timeRepoData = this.timeRepoService.calculateAllEmps(emps, count);


    }



  }
  exportToExcel(): void {
    let element = document.getElementById('table');
    console.log(element);

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "report");
    XLSX.writeFile(wb, this.file_name);
  }

  applyCalled(event: any) {



  }
  onSelectDept(event: any) {


    if (event.value != "") {

      var emps = this.timeRepoData.filter((emp) => {


        return emp.dept_name === event.value;
      });
      this.timeRepoData = emps;
    } else {
      this.getAllTimeReports();
    }



  }
  onSelectSection(event: any) {

    if (event.value != "") {

      var emps = this.timeRepoData.filter((emp) => {


        return emp.sect_desc === event.value;
      });
      this.timeRepoData = emps;
    } else {
      this.getAllTimeReports();
    }



  }
  sortData(sort: Sort) {
    const data = this.timeRepoData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'cardid':
          return compare(a.cardId!, b.cardId!, isAsc);
        case 'empname':
          return compare(a.emp_name!, b.emp_name!, isAsc);
        case 'month':
          return compare(a.month!, b.month!, isAsc);
        case 'year':
          return compare(a.year!, b.year!, isAsc);
        case 'absent':
          return compare(a.total_absent!, b.total_absent!, isAsc);
        case 'sick':
          return compare(a.total_sick!, b.total_sick!, isAsc);
        case 'mission':
          return compare(a.total_mission!, b.total_mission!, isAsc);
        case 'ordinary':
          return compare(a.total_oridinary_vacation!, b.total_oridinary_vacation!, isAsc);
        case 'casual':
          return compare(a.total_casual_vacation!, b.total_casual_vacation!, isAsc);
        case 'permission':
          return compare(a.total_permission!, b.total_permission!, isAsc);
        case 'company':
          return compare(a.company_name!, b.company_name!, isAsc);
        case 'deptname':
          return compare(a.dept_name!, b.dept_name!, isAsc);
        case 'sectname':
          return compare(a.sect_desc!, b.sect_desc!, isAsc);
        default:
          return 0;
      }
    });

  }

  resetFilters() {
    this.ngOnInit();
  }


}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


