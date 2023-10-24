import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Department } from 'shared/models/department';
import { Employee } from 'shared/models/employee';
import { job } from 'shared/models/job';
import { SectionModel } from 'shared/models/section';

@Component({
  selector: 'app-editemp',
  templateUrl: './editemp.component.html',
  styleUrls: ['./editemp.component.css'],
})
export class EditempComponent implements OnInit {
  form!: FormGroup;
  currentEmployee!:Employee;
  sectionDescription:string='';
  jobTitleDescription:string='';
  insurance:string='';
  departmentName: string = '';
  employeename: string = '';
  ordinaryVacation:string='';
  casualVacation:string='';
  hiredate!:Date;
  emailaddress: string = '';
  manager_email_address: string = '';
  role: string = '';
  emp_status: string = '';
  departments: Department[] = [];
  allJobs:job[]=[];
  allSects:SectionModel[]=[];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditempComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.currentEmployee=data['emp'];

    console.log(this.currentEmployee);


    this.allJobs=data['jobs'];
    this.allSects=data['sects'];
    this.employeename = data['emp'].employee_name!;
    this.departmentName = data['emp'].department_name!;
    this.emailaddress = data['emp'].email_address;
    this.manager_email_address = data['emp'].manager_email_address;
    this.role = data['emp'].rule!;
    this.departments = data['depts'];
    this.emp_status = data['emp'].status;
    this.hiredate=data['emp'].hire_date;
    this.casualVacation=data['emp'].casual_vacation;
    this.ordinaryVacation=data['emp'].ordinary_vacation;
    this.sectionDescription=this.currentEmployee.sect_desc!;
    this.jobTitleDescription=this.currentEmployee.job_title!;
    this.insurance=this.currentEmployee.insurance!;



  }
  ngOnInit(): void {
    this.form = this.fb.group({
      departmentName: this.departmentName,
      role: this.role,
      employeename: this.employeename,
      emp_status: this.emp_status,
      emailaddress: this.emailaddress,
      manager_email_address: this.manager_email_address,
      hiredate:this.hiredate,
      casual_vacation:this.casualVacation,
      ordinary_vacation:this.ordinaryVacation,
      sect_desc:this.sectionDescription,
      job_title:this.jobTitleDescription,
      insurance:this.insurance,

    });
  }
  close() {
    this.dialogRef.close(null);
  }
  save() {
    this.dialogRef.close(this.form.value);
  }
  getChangedDate(event: MatDatepickerInputEvent<Date>){
    this.hiredate = event.target.value!;
  }
}
