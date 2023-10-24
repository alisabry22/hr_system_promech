import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeserviceService } from '../services/employeeservice.service';
import { Employee } from 'shared/models/employee';
import { Department } from 'shared/models/department';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditempComponent } from '../editemp/editemp.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
import { SendMailsComponent } from '../send-mails/send-mails.component';
import { DatePipe } from '@angular/common';
import { job } from 'shared/models/job';
import { SectionModel } from 'shared/models/section';
@Component({
  selector: 'app-allemp',
  providers: [DatePipe],
  templateUrl: './allemp.component.html',
  styleUrls: ['./allemp.component.css'],
})
export class AllempComponent implements OnInit {
  employees = [];
  final_emps: Employee[] = [];
  message: string = '';
  alertShown: boolean = false;
  //before barsing
  job = [];
  sect = [];
  allJobs: job[] = [];
  allsects: SectionModel[] = [];
  state: string = '';
  sortedEmps: Employee[] = [];
  filter_emp: string = '';
  emailFail: boolean = false;
  list_of_emps_mails: Employee[] = [];
  departments = [];
  final_departs: Department[] = [];
  isSelected: boolean = false;

  constructor(
    private router: Router,
    private employeeService: EmployeeserviceService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.list_of_emps_mails = [];
    this.emailFail = false;
    this.isSelected = false;
    this.employeeService.getAllEmployees().subscribe({
      next: (event: any) => {
        this.state = event.state;
        this.employees = event.allemp;
        this.departments = event.alldept;
        this.job = event.job;
        this.sect = event.sect;
        //get all employee data from backend
        this.final_emps = this.employees.map((val) => ({
          card_id: val[0],
          employee_name: val[1],
          job_title: val[2],
          hire_date: val[3],
          dept_code: val[4],
          status: val[5],
          sect_code: val[6],
          sect_desc: val[7],
          formatted_hire_date: this.datePipe.transform(val[3], 'dd-MM-YYYY')!,
          department_name: val[8],

          rule: val[9],
          email_address: val[10],
          manager_email_address: val[11],
          company_name: val[12],
          casual_vacation: val[13],
          ordinary_vacation: val[14],
          insurance:val[15],
        }));
        //get all sections from backend
        this.allJobs = this.job.map((val) => ({
          job_id: val[0],
          job_desc: val[1],
        }));
        //parse all sections from backend
        this.allsects = this.sect.map((val) => ({
          sect_code: val[0],
          sect_description: val[1],
        }));

        this.sortedEmps = this.final_emps.slice();
        this.final_departs = this.departments.map((val) => ({
          dept_desc: val[1],
          dept_id: val[0],
        }));
      },
      error: (event: any) => {
        if (event instanceof HttpErrorResponse) {
          if (event.status == 403) this.router.navigate(['login']);
        }
      },
    });
  }
  //this dialog will open once admin clicks on each row of employees to edit his/her values
  openEditEmployeeDialog(emp: Employee) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.height = '90vh';

    dialogConfig.data = {
      emp,
      depts: this.final_departs,
      jobs: this.allJobs,
      sects: this.allsects,
    };

    const dialogRef = this.dialog.open(EditempComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        console.log('dats after close is ', data);
        let jobId= this.allJobs.filter((job)=>job.job_desc==data['job_title']).at(0)?.job_id!;
        let sect_code=this.allsects.filter((sect)=>sect.sect_description==data['sect_desc']).at(0)?.sect_code;
        this.editEmployee(
          emp.card_id!,
          emp.company_name!,
          data['employeename'],
          data['departmentName'],
          data['role'],
          data['emp_status'],
          data['emailaddress'] != null ? data['emailaddress'] : '',
          data['manager_email_address'] != null
            ? data['manager_email_address']
            : '',
          data['hiredate'],
          data['casual_vacation'],
          data['ordinary_vacation'],
          jobId,
          sect_code!.toString(),
          data['insurance'],
        );
      }
    });
  }
  //this function works once dialog is closed to edit employee data
  editEmployee(
    card_id: string,
    company_name: string,
    empname: string,
    departname: string,
    role: string,
    status: string,
    email_address: string,
    manager_email_address: string,
    hiredate: Date,
    casual_vacation: string,
    ordinary_vacation: string,
    job_code:string,
    sect_code:string,
    insurance:string,
  ) {
    this.employeeService
      .editEmployeeData(
        card_id,
        company_name,
        empname,
        departname,
        role,
        status,
        email_address,
        manager_email_address,
        hiredate,
        casual_vacation,
        ordinary_vacation,
        job_code,
        sect_code,
        insurance
      )
      .subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.state = event.body.state;
            this.message = event.body.message;
            this.alertShown = true;
          } else if (event instanceof HttpErrorResponse) {
            this.state = event.error;
            this.message = event.message;
            this.alertShown = true;
          } else {
            this.state = event.state;
            this.message = event.message;
            this.alertShown = true;
            this.ngOnInit();
          }
        },
      });
  }

  closeAlert() {
    this.alertShown = false;
  }
  //for implementing sort employees by different categories
  sortEmps(sort: Sort) {
    const data = this.final_emps.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedEmps = data;
      return;
    }
    this.sortedEmps = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'cardid':
          return compare(a.card_id!, b.card_id!, isAsc);
        case 'empname':
          return compare(a.employee_name!, b.employee_name!, isAsc);
        case 'deptname':
          return compare(a.department_name!, b.department_name!, isAsc);
        case 'jobtitle':
          return compare(a.job_title!, b.job_title!, isAsc);
        case 'status':
          return compare(a.status!, b.status!, isAsc);
        case 'role':
          return compare(a.rule!, b.rule!, isAsc);
        case 'hiredate':
          return compare(a.hire_date!, b.hire_date!, isAsc);
        default:
          return 0;
      }
    });
  }

  sendEmail(data: any) {
    let list_of_ccs: string[] = data.cc;
    let form_Data = data.form;

    if (this.list_of_emps_mails.length != 0) {
      //call api to send emails to employees if the list of choosen employees is not empty
      this.employeeService
        .sendEmail(form_Data, list_of_ccs, this.list_of_emps_mails)
        .subscribe({
          next: (event: any) => {
            console.log('event', event);
            this.state = event.state;
            this.message = event.message;
            this.alertShown = true;
          },
          error: (event: any) => {
            this.state = event.state;
            this.message = event.message;
            this.emailFail = true;
            this.alertShown = true;
          },
        });

      this.ngOnInit();
    } else {
      alert('ewew');
    }
  }

  //for check box changes
  checkBoxChanged(event: any, emp: Employee) {
    console.log(this.list_of_emps_mails.includes(emp));

    if (this.list_of_emps_mails.includes(emp)) {
      const index = this.list_of_emps_mails.indexOf(emp);
      if (index > -1) {
        this.list_of_emps_mails.splice(index, 1);
      }
    } else {
      this.list_of_emps_mails.push(emp);
    }
    console.log('list of emps ', this.list_of_emps_mails);
  }
  changeSelectAll(event: any) {
    this.isSelected = !this.isSelected;
    if (this.isSelected) {
      for (let emp of this.final_emps) {
        if (
          !(
            emp.status == '2' ||
            emp.email_address == null ||
            emp.email_address.length === 0
          )
        ) {
          this.list_of_emps_mails.push(emp);
        }
      }
    } else {
      this.list_of_emps_mails = [];
    }
  }
  openDialogSendMails(event: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.height = '90vh';

    dialogConfig.data = { emps: this.list_of_emps_mails };

    const dialogRef = this.dialog.open(SendMailsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if (data != null) {
        //this means admin click save button
        this.sendEmail(data);
      }
    });
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
