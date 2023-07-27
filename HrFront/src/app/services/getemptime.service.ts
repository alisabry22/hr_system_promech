import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GET_ALL_EMP_TIME } from '../url';

@Injectable({
  providedIn: 'root'
})
export class GetemptimeService {

  constructor(private http:HttpClient) { }

  getAllEmpTime():Observable<any>{
    return this.http.get(GET_ALL_EMP_TIME);
  }
}
