import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GET_ALL_EMPS_TIME_HISTORY_URL } from '../url';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http:HttpClient) { }

  getAllEmpsHistory():Observable<any>{
    return this.http.get(GET_ALL_EMPS_TIME_HISTORY_URL);
  }
}
