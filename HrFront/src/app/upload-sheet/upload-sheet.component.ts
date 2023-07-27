import { Component } from '@angular/core';
import { UploadsheetService } from '../services/uploadsheet.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-upload-sheet',
  templateUrl: './upload-sheet.component.html',
  styleUrls: ['./upload-sheet.component.css']
})
export class UploadSheetComponent {
  files!:File[];
  state:String="";
  message:String="";
  canBeProcessed:boolean=true;
  alertShown:Boolean=false;
  constructor(private uploadsheetservice:UploadsheetService){

  }

  closeAlert(){
    this.alertShown=false;
  }
  onsubmit(){
    if(this.files){
      if(this.files.length>3 || this.files.length==0){

        this.state="error";
        this.message="you must choose only 3 files";
        this.alertShown=true;
      }else{
        for(let file of  this.files){
          if(file.name!="promech.xlsx" && file.name!="penta3d.xlsx" && file.name!="promech12.xlsx"){
            this.state="error";
            this.message="names must be promech.xlsx , penta3d.xlsx , promech12.xlsx";
             this.alertShown=true;
             this.canBeProcessed=false;


          }else{
            this.canBeProcessed=true;
          }
        }
        if(this.canBeProcessed){
          this.uploadsheetservice.upload(this.files).subscribe({
            next:(event:any)=>{
               if (event instanceof HttpResponse){
              this.state=event.body.state;
            this.message=event.body.message;
            this.alertShown=true;
              }else if (event instanceof HttpErrorResponse){
                this.state=event.error;
                this.message=event.message;
                this.alertShown=true;

              }
            }
          });
         }


      }


    }

  }
  onFileSelected(event:any){
    if(event.target.files.length>0 ){

      this.files=event.target.files;

    }
  }
}
