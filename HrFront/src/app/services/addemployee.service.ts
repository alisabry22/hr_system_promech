import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADD_NEW_EMP, GET_ALL_DEPARTMENTS } from '../url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddemployeeService {
  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<any> {
    return this.http.get(GET_ALL_DEPARTMENTS);
  }
  addnewEmployee(
    empname: string,
    department: string,
    job: string,
    emptype: string,
    hiredate: Date,
    ordinary_vacation: string,
    casual_vacation: string,
    company_name: string,
    cardId: string,
    sectCode: string,
    email_address:string,
    manager_email_address:string,
  ): Observable<any> {
    console.log(  empname,
      department,
      job,
      emptype,
      hiredate,
      ordinary_vacation,
      casual_vacation,
      company_name,
      cardId,
      sectCode,
      email_address,
      manager_email_address);

    let body = new URLSearchParams();
    body.set('empname', empname);
    body.set('emptype', emptype);
    body.set('department', department);
    body.set('job', job);
    body.set('hiredate', hiredate.toLocaleString());
    body.set('ordinary_vacation', ordinary_vacation);
    body.set('casual_vacation', casual_vacation);
    body.set('card_id', cardId);
    body.set('company_name', company_name);
    body.set('sect_code', sectCode);
    body.set('email_address',email_address);
    body.set('manager_email_address',manager_email_address);

    return this.http.post(ADD_NEW_EMP, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }
}
