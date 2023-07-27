import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UPLOAD_SHEET_TO_DATABASE } from '../url';

@Injectable({
  providedIn: 'root'
})
export class UploadsheetService {

  constructor(private http:HttpClient) {

   }

   upload(files:File[]):Observable<any>{
    const formData:FormData=new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("uploadfile", files[i])
    }
    return  this.http.post(UPLOAD_SHEET_TO_DATABASE,formData,{
      reportProgress:true,
      observe:'events',
     });
   }

}
