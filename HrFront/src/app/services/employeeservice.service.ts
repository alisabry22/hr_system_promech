import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EDIT_EMPLOYEE_URL, GET_ALL_EMPS, SEND_EMAIL_REQUEST } from '../url';
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
    empname: string,
    department: string,
    role: string,
    status: string,
    email_address: string,
    manager_email_address: string
  ): Observable<any> {
    let body = new URLSearchParams();
    body.set('empname', empname);
    body.set('departmentName', department);
    body.set('role', role);
    body.set('status', status);
    body.set('email_address', email_address);
    body.set('manager_email_address', manager_email_address);

    return this.http.post(EDIT_EMPLOYEE_URL, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  sendEmail(emp: Employee): Observable<any> {
    let body = new URLSearchParams();
    body.set('card_id', emp.card_id!);
    body.set('emp_name', emp.employee_name);
    body.set('email_address', emp.email_address!);
    body.set('manager_email_address', emp.manager_email_address ?? '');
    body.set('company_name', emp.company_name!);
    console.log(body.toString());

    return this.http.post(SEND_EMAIL_REQUEST, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }
}
