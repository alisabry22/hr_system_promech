import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit{
  ngOnInit(): void {
    var token= sessionStorage.getItem("token");
    if(!token){
      this.router.navigate(["login"]);
    }
  }

  constructor(private router:Router){
    var token= sessionStorage.getItem("token");
    if(!token){
      this.router.navigate(["login"]);
    }
  }

}
