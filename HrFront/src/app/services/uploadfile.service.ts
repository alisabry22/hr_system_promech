import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UPLOAD_EXCEL_URL } from '../url';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class UploadfileService {

  constructor(private http:HttpClient) {

    }



   upload(file:File,fileType:String):Observable<any> {
    const formData:FormData=new FormData();
    formData.append('file',file);
    formData.append("fileType",fileType.toString());
   // console.log(formData);
   return  this.http.post(UPLOAD_EXCEL_URL,formData,{
    reportProgress:true,
    observe:'events',
   });

  };

   }





