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

  state: string = '';
  sortedEmps: Employee[] = [];
  filter_emp: string = '';
  emailFail:boolean=false;
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
    this.emailFail=false;
    this.isSelected = false;
    this.employeeService.getAllEmployees().subscribe({
      next: (event: any) => {
        this.state = event.state;
        this.employees = event.allemp;
        this.departments = event.alldept;

        this.final_emps = this.employees.map((val) => ({
          card_id: val[0],
          employee_name: val[1],
          job_title: val[2],
          hire_date: val[3],
          status: val[5],
          sect_code: val[6],
          formatted_hire_date: this.datePipe.transform(
            val[3],
            'dd-MM-YYYY',
            'UTC'
          )!,
          department_name: val[7],

          rule: val[8],
          email_address: val[9],
          manager_email_address: val[10],
          company_name: val[11],
        }));

        this.sortedEmps = this.final_emps.slice();
        this.final_departs = this.departments.map((val) => ({
          dept_desc: val[0],
          dept_id: val[1],
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

    dialogConfig.data = { emp, depts: this.final_departs };

    const dialogRef = this.dialog.open(EditempComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.editEmployee(
          data['employeename'],
          data['departmentName'],
          data['role'],
          data['emp_status'],
          data['emailaddress'] != null ? data['emailaddress'] : '',
          data['manager_email_address'] != null
            ? data['manager_email_address']
            : ''
        );
      }
    });
  }
//this function works once dialog is closed to edit employee data
  editEmployee(
    empname: string,
    departname: string,
    role: string,
    status: string,
    email_address: string,
    manager_email_address: string
  ) {
    this.employeeService
      .editEmployeeData(
        empname,
        departname,
        role,
        status,
        email_address,
        manager_email_address
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
            console.log("event",event);
            this.state=event.state;
            this.message=event.message;
            this.alertShown=true;
          },
          error: (event: any) => {
            this.state=event.state;
            this.message=event.message;
            this.emailFail=true;
            this.alertShown=true;
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
