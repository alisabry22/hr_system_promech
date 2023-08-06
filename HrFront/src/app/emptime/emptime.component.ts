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
        card_id: val["card_id"],
        emp_name: val["emp_name"],
        date_day: val["date"],
        clock_in: val["clock_in"],
        clock_out: val["clock_out"],
        late: val["late"],
        early: val["early"],
        absent_flag: val["absent"],
        remarks: val["remarks"],
        trans_amt: val["trans"],
        company_name:val["company_name"],
      }));
      console.log("get_emps_time",this.get_emps_time);

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
    dialogConfig.height = "70vh";

    dialogConfig.data = emp;

    const dialogRef = this.dialog.open(EditemptimeComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data: EmpTime) => {
      
    
        
        //this condition means edits will be only on absent users
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
