import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EDIT_EMPLOYEE_URL, EDIT_EMP_TIME, GET_ALL_EMP_TIME } from '../url';
import { EmpTime } from 'shared/models/emptime';

@Injectable({
  providedIn: 'root'
})
export class GetemptimeService {

  constructor(private http:HttpClient) { }

  getAllEmpTime():Observable<any>{
    return this.http.get(GET_ALL_EMP_TIME);
  }

  //edit employee 
  editEmployeeTimeSheet(empTime:EmpTime):Observable<any>{
    console.log("empTime",empTime);
    let body = new URLSearchParams();
    body.set('card_id',empTime.card_id!);
    body.set('date',empTime.date_day!);
    body.set('company_name',empTime.company_name!);
    body.set("trans",empTime.trans_amt!.toString());
    body.set("remarks",empTime.remarks!);
    console.log(EDIT_EMP_TIME);
    return this.http.post(EDIT_EMP_TIME,body.toString(),{headers:{'Content-Type': 'application/x-www-form-urlencoded'}});
  }
}
