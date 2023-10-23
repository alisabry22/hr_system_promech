import { Component, OnInit } from '@angular/core';
import { DashboardServicesService } from '../services/dashboard-services.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { HttperrorComponent } from '../httperror/httperror.component';
import { Employee } from 'shared/models/employee';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalemp: number = 0;
  totaldept: number = 0;
  totaljobs: number = 0;
  topFive:any[]=[];
  latest_emps: Employee[] = [];
  state: string = '';
  message: string = '';
  totalsects: number = 0;
  alertShown: boolean = false;
  ngOnInit(): void {
    this.getDashboardData();
  }
  constructor(
    private router: Router,
    private dashboardServices: DashboardServicesService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  getDashboardData() {
    return this.dashboardServices.getAllDashboardData().subscribe({
      next: (event: any) => {
        if (event instanceof HttpErrorResponse) {
          this.state = 'error';
          this.message = event.message;
          this.alertShown = true;
        } else {



          this.state = event.state;
          this.totalemp = event.totalemp;
          this.totaldept = event.totaldept;
          this.totaljobs = event.totaljob;
          this.totalsects = event.totalsect;
          this.topFive=event.topfive;
          console.log(event.totalemp);

          this.latest_emps = event.latest_emps.map((val: any) => ({
            card_id: val[0],
            employee_name: val[2],
            hire_date: val[10],
            department_name: val[8],
            formatted_hire_date:
              val[10] != null
                ? this.datePipe.transform(val[10], 'dd-MM-YYYY', 'UTC')
                : '',
          }));
        }
      },
      error: (event: any) => {
        if (event instanceof HttpErrorResponse) {
          this.router.navigate(['login']);
        } else {
          this.openDialog();
        }
      },
    });
  }

  openDialog() {
    this.dialog.open(HttperrorComponent);
  }

  closeAlert() {
    this.alertShown = false;
  }
}
