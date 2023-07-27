import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { EDIT_EMPLOYEE_URL, GET_ALL_EMPS } from '../url';
@Injectable({
  providedIn: 'root'
})
export class EmployeeserviceService {


  constructor( private http:HttpClient) { }

  getAllEmployees():Observable<any>{
    return this.http.get(GET_ALL_EMPS);
  }
  editEmployeeData(empname:string,department:string,role:string):Observable<any>{
    let body = new URLSearchParams();
    body.set('empname',empname);
    body.set('departmentName',department);
    body.set('role',role);

    return this.http.post(EDIT_EMPLOYEE_URL,body.toString(),{headers:{'Content-Type': 'application/x-www-form-urlencoded'}});
  }
}
