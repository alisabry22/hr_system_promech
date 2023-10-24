import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EDIT_EMPLOYEE_URL,
  GET_ALL_EMAILS_REQUEST,
  GET_ALL_EMPS,
  SEND_EMAIL_REQUEST,
} from '../url';
import { Employee } from 'shared/models/employee';
@Injectable({
  providedIn: 'root',
})
export class EmployeeserviceService {
  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<any> {
    return this.http.get(GET_ALL_EMPS);
  }
  editEmployeeData(
    card_id:string,
    company_name:string,
    empname: string,
    department: string,
    role: string,
    status: string,
    email_address: string,
    manager_email_address: string,
    hire_date:Date,
    casual_vacation:string,
    ordinary_vacation:string,
    job_code:string,
    sect_code:string,
    insurance:string,
  ): Observable<any> {
    let body = new URLSearchParams();
    body.set('card_id',card_id);
    body.set('company_name',company_name);
    body.set('empname', empname);
    body.set('departmentName', department);
    body.set('role', role);
    body.set('status', status);
    body.set('email_address', email_address);
    body.set('manager_email_address', manager_email_address);
    body.set('hiredate',hire_date.toLocaleString());
    body.set('casual_vacation',casual_vacation);
    body.set('ordinary_vacation',ordinary_vacation);
    body.set('job_code',job_code);
    body.set('sect_code',sect_code);
    body.set('insurance_no',insurance);

   // body.set('hiredate',hire_date.toloc)

    return this.http.post(EDIT_EMPLOYEE_URL, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  sendEmail(
    form: any,
    list_of_ccs: string[],
    emp: Employee[]
  ): Observable<any> {
    var data = { emps: emp, form: form, cc: list_of_ccs };

    return this.http.post(SEND_EMAIL_REQUEST, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  loadAllEmailsFromDb(): Observable<any> {
    return this.http.get(GET_ALL_EMAILS_REQUEST);
  }
}
