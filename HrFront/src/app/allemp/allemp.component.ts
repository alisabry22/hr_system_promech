import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeserviceService } from '../services/employeeservice.service';
import { Employee } from 'shared/models/employee';
import { Department } from 'shared/models/department';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditempComponent } from '../editemp/editemp.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
@Component({
  selector: 'app-allemp',
  templateUrl: './allemp.component.html',
  styleUrls: ['./allemp.component.css']
})
export class AllempComponent implements OnInit {
  employees = [];
  final_emps: Employee[] = [];
  message: string = "";
  alertShown: boolean = false;
  state: string = "";
  sortedEmps: Employee[] = [];
  filter_emp:string="";

  departments = [];
  final_departs: Department[] = [];
  constructor(private route: ActivatedRoute, private employeeService: EmployeeserviceService, private dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((response) => {

      this.state = response.state;
      this.employees = response.allemp;
      this.departments = response.alldept;

      this.final_emps = this.employees.map((val => ({ card_id: val[0], employee_name: val[1],job_title:val[2],hire_date:val[3],status:val[5],sect_code:val[6],department_name:val[7],rule:val[8]})));
      this.sortedEmps = this.final_emps.slice();
      this.final_departs = this.departments.map(val => ({ dept_desc: val[0], dept_id: val[1] }));

      console.log(this.final_emps);


    });


  }
  openDialog(emp: Employee) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "30%";
    dialogConfig.height = "80vh";


    dialogConfig.data = { emp, depts: this.final_departs };

    const dialogRef = this.dialog.open(EditempComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
    if(data){

      this.editEmployee(data["employeename"], data["departmentName"], data["role"],data["emp_status"]);
    }


    });

  }

  editEmployee(empname: string, departname: string, role: string, status: string) {
    console.log(empname,departname,role,status);

    this.employeeService.editEmployeeData(empname, departname, role, status).subscribe({
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

      }
    });
  }

  closeAlert() {
    this.alertShown = false;
  }

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
        case 'role':
          return compare(a.rule!, b.rule!, isAsc);
        default:
          return 0;
      }
    });

  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
