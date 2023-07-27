import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeserviceService } from '../services/employeeservice.service';
import { Employee } from 'shared/models/employee';
import { Department } from 'shared/models/department';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditempComponent } from '../editemp/editemp.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
@Component({
  selector: 'app-allemp',
  templateUrl: './allemp.component.html',
  styleUrls: ['./allemp.component.css']
})
export class AllempComponent implements OnInit{
  employees=[];
  final_emps:Employee[]=[];
  message:string="";
  alertShown:boolean=false;
  state:string="";
  sortedEmps:Employee[]=[];

  departments=[];
  final_departs:Department[]=[];
  constructor(private route:ActivatedRoute,private employeeService:EmployeeserviceService,private dialog:MatDialog ){

  }
  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((response)=>{

      this.state=response.state;
      this.employees=response.result;
      this.departments=response.departments;


      console.log(this.employees);
      this.final_emps=this.employees.map((val=>({card_id:val["CARD_ID"],employee_name:val["EMP_NAME"],department_name:val["DEPT_DESC"],rule:val["RULE_DESC"],hire_date:val["HIRE_DATE"],status:val["STATUS"]})));
        console.log(this.employees);
        this.sortedEmps=this.final_emps.slice();
      this.final_departs=this.departments.map(val=>({dept_desc:val["DEPT_DESC"],dept_id:val["DEPT_CODE"]}));

    });


  }
  openDialog(emp:Employee){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.hasBackdrop=true;
    dialogConfig.autoFocus=true;
    dialogConfig.width="30%";
    dialogConfig.height="70vh";

    dialogConfig.data={emp,depts:this.final_departs};

 const dialogRef=   this.dialog.open(EditempComponent,dialogConfig);

 dialogRef.afterClosed().subscribe( (data)=>{
 this.editEmployee(data["employeename"],data["departmentName"],data["role"]);
});

  }

  editEmployee(empname:string,departname:string,role:string){
    this.employeeService.editEmployeeData(empname,departname,role).subscribe({
      next:(event:any)=>{
        if (event instanceof HttpResponse){
       this.state=event.body.state;
     this.message=event.body.message;
     this.alertShown=true;
       }else if (event instanceof HttpErrorResponse){
         this.state=event.error;
         this.message=event.message;
         this.alertShown=true;

       }else{
        this.state=event.state;
        this.message=event.message;
        this.alertShown=true;
        this.ngOnInit();
       }

     }
    });
  }

  closeAlert(){
    this.alertShown=false;
  }

  sortEmps(sort:Sort){
    const data=this.final_emps.slice();
    if(!sort.active||sort.direction===''){
      this.sortedEmps=data;
      return;
    }
    this.sortedEmps=data.sort((a,b)=>{
      const isAsc=sort.direction==='asc';
      switch(sort.active){
        case 'cardid':
          return compare(a.card_id!,b.card_id!,isAsc);
        case 'empname':
          return compare(a.employee_name!,b.employee_name!,isAsc);
        case 'deptname':
            return compare(a.department_name!,b.department_name!,isAsc) ;
        case 'role':
          return compare(a.rule!,b.rule!,isAsc);
            default:
              return 0;
      }
    });

  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
