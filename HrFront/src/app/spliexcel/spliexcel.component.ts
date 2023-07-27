import { Component, OnInit } from '@angular/core';
import {  HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { UploadfileService } from '../services/uploadfile.service';
import { NgStyle } from '@angular/common';
@Component({
  selector: 'app-spliexcel',
  templateUrl: './spliexcel.component.html',
  styleUrls: ['./spliexcel.component.css']
})
export class SpliexcelComponent implements OnInit {

  uploaded:boolean=false;

  ngOnInit(): void {

  }
   file!: File;
   state:String="";
   progress:number=0;
   message:String="";
   alertShown:boolean=false;
   fileType="Promech";
    constructor(private uploadfile:UploadfileService){}
    onFileSelected(event:any){
      if(event.target.files.length>0){

        this.file=event.target.files[0];
      }


    }

    onsubmit(){
      console.log(this.fileType,this.file);
      this.progress=0;
      if(this.fileType=="Promech"&&this.file.name!="promech.xlsx"){
        this.state="error";
        this.message="File name must be promech.xlsx";
        this.alertShown=true;
      }
      else if(this.fileType=="Penta3d"&&this.file.name!="penta3d.xlsx"){
        this.state="error";
        this.message="File name must be penta3d.xlsx";
        this.alertShown=true;
      }
      else if(this.fileType=="Promech12"&&this.file.name!="promech12.xlsx"){
        this.state="error";
        this.message="File name must be promech12.xlsx";
        this.alertShown=true;
      }else{
        this.uploadfile.upload(this.file,this.fileType).subscribe({
          next:(event:any)=>{
            if(event.type===HttpEventType.UploadProgress){
              this.progress=Math.round(100*event.loaded/event.total);
            }else if (event instanceof HttpResponse){
            this.state=event.body.state;
          this.message=event.body.message;
          this.alertShown=true;
          if(this.state=="error"){
            this.progress=0;
          }
            }else if(event instanceof HttpErrorResponse){
              this.state=event.error;
              this.message=event.message;
              this.alertShown=true;
            }
          }


        });
      }


    }
    onSelectChange(event:any){

      this.fileType=event.target.options[event.target.options.selectedIndex].text
      console.log(this.fileType);
    }

    closeAlert(){
     this.alertShown=false;
    }

}


