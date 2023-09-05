import { Component, OnInit } from '@angular/core';
import { EmpTime } from 'shared/models/emptime';
import { GetemptimeService } from '../services/getemptime.service';
import { HttpResponse } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { EditemptimeComponent } from '../editemptime/editemptime.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Employee } from 'shared/models/employee';
@Component({
  selector: 'app-emptime',
  templateUrl: './emptime.component.html',
  styleUrls: ['./emptime.component.css']
})
export class EmptimeComponent implements OnInit {
  getemps = [];
  get_emps_time: EmpTime[] = [];
  showLoading: boolean = false;
  pagination: number = 1;
  filter_text: string = "";
  ngOnInit(): void {

    this.showLoading = true;
    this.getAllEmpTime();
    this.showLoading = false;

  }
  constructor(private empTimeService: GetemptimeService, private dialog: MatDialog) { }


  getAllEmpTime() {
    this.empTimeService.getAllEmpTime().subscribe(response => {

      this.getemps = response.emptime;

      this.get_emps_time = this.getemps.map(val => ({
        card_id: val[0],
        emp_name: val[1],
        date_day: val[2],
        clock_in: val[3],
        clock_out: val[4],
        late: val[5],
        early: val[6],
        absent_flag: val[7],
        remarks: val[8],
        trans_amt: val[9],
        company_name:val[10],
      }));

    });




  }

  renderPage(event: number) {
    this.pagination = event;
    this.getAllEmpTime();
  }
  openDialog(emp: EmpTime) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.height = "75vh";

    dialogConfig.data = emp;

    const dialogRef = this.dialog.open(EditemptimeComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data: EmpTime) => {




        this.empTimeService.editEmployeeTimeSheet(data).subscribe(response=>{
          console.log(response);
         if(response.state==="success"){
          this.ngOnInit();
         }
        });


    }
    );



  }


}
