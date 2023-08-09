import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GET_ALL_TIME_REPO } from '../url';

@Injectable({
  providedIn: 'root'
})
export class TimerepoService  {

  constructor(private http:HttpClient) { 

  }

  getAllTimeReportData():Observable<any>{
    return this.http.get(GET_ALL_TIME_REPO);
  }

 
}
