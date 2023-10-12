import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Department } from 'shared/models/department';
import { Employee } from 'shared/models/employee';

@Component({
  selector: 'app-editemp',
  templateUrl: './editemp.component.html',
  styleUrls: ['./editemp.component.css'],
})
export class EditempComponent implements OnInit {
  form!: FormGroup;
  departmentName: string = '';
  employeename: string = '';
  emailaddress: string = '';
  manager_email_address: string = '';
  role: string = '';
  emp_status: string = '';
  departments: Department[] = [];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditempComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.employeename = data['emp'].employee_name!;
    this.departmentName = data['emp'].department_name!;
    this.emailaddress = data['emp'].email_address;
    this.manager_email_address = data['emp'].manager_email_address;
    this.role = data['emp'].rule!;
    this.departments = data['depts'];
    this.emp_status = data['emp'].status;
    console.log(this.emp_status);
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      departmentName: this.departmentName,
      role: this.role,
      employeename: this.employeename,
      emp_status: this.emp_status,
      emailaddress: this.emailaddress,
      manager_email_address: this.manager_email_address,
    });
  }
  close() {
    this.dialogRef.close(null);
  }
  save() {
    this.dialogRef.close(this.form.value);
  }
}
