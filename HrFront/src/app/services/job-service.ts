import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ADD_NEW_JOB, GET_ALL_JOBS } from '../url';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http:HttpClient){}
  getAllJobs():Observable<any>{
    return this.http.get(GET_ALL_JOBS);
  }

  addNewJob(jobname:string):Observable<any>{
    let body = new URLSearchParams();
    body.set("jobname",jobname);

    return this.http.post(ADD_NEW_JOB,body.toString(),{headers:{'Content-Type': 'application/x-www-form-urlencoded'}});
  }


}
