import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string="";
  password:string="";
  message:string="";
  state:string="";
  alertShown:boolean=false;
  constructor(private loginService:LoginService,private router:Router){}
  ngOnInit(): void {

  }

  login(event:any){
    this.username=event.target.username.value;
    this.password=event.target.password.value;
    if(!this.username||!this.password){

      window.alert("Please fill in all fields");
    }else{
      this.loginService.loginRequest(this.username,this.password).subscribe({
        next:(event:any)=>{





          sessionStorage.setItem("token",event.token);

          this.router.navigate(["dashboard"]);
        },
        error:(event:any)=>{
          if(event instanceof HttpErrorResponse){
              window.alert(event.error.message);

          }
        }
      });
    }



  }
  closeAlert(){
    this.alertShown=false;
    this.message="";
    this.state="";

  }
}
