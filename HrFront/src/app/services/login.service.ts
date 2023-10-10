import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LOGIN_REQUEST_URL } from '../url';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private LoggedIn:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient) { }

   loginRequest(username:string,password:string):Observable<any>{
    let body = new URLSearchParams();

    body.set('username',username);
    body.set('password',password);


    return this.http.post(LOGIN_REQUEST_URL,body.toString(),{headers:{'Content-Type': 'application/x-www-form-urlencoded'}});
  }

  get isLoggedIn(): Observable<boolean>{
    return this.LoggedIn.asObservable();
  }
}
