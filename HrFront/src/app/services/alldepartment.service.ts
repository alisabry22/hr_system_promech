import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADD_NEW_DEPARTMENT, DELETE_DEPARTMENTS, GET_ALL_DEPARTMENTS } from '../url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlldepartmentService {

  constructor(private http:HttpClient) { }

  getAllDepts():Observable<any>{
    return this.http.get(GET_ALL_DEPARTMENTS);
  }

  addNewDepartment(deptname:string):Observable<any>{
    let body = new URLSearchParams();
    body.set("deptname",deptname);

    return this.http.post(ADD_NEW_DEPARTMENT,body.toString(),{headers:{'Content-Type': 'application/x-www-form-urlencoded'}});
  }

  deleteDepartments(dept_codes:string[]):Observable<any>{
    console.log(JSON.stringify(dept_codes));
    let params = new URLSearchParams();


    dept_codes.forEach((element)=> params.append("dept_codes",element));

        return this.http.post(DELETE_DEPARTMENTS,params.toString(),{headers:{'Content-Type': 'application/x-www-form-urlencoded'}},);
  }
}
