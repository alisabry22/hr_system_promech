import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GET_DASHBOARD_DATA } from '../url';

@Injectable({
  providedIn: 'root'
})
export class DashboardServicesService {

  constructor(private http:HttpClient) { }

  getAllDashboardData():Observable<any>{
    console.log(GET_DASHBOARD_DATA);
    return this.http.get(GET_DASHBOARD_DATA);

  }
}
