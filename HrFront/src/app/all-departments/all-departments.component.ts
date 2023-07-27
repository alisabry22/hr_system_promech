import { Component, OnInit, PipeTransform } from '@angular/core';
import { Department } from 'shared/models/department';
import { AlldepartmentService } from '../services/alldepartment.service';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { AddDepartmentComponent } from '../add-department/add-department.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
import { DeleteDepartmentComponent } from '../delete-department/delete-department.component';


@Component({
  selector: 'app-all-departments',
  templateUrl: './all-departments.component.html',
  styleUrls: ['./all-departments.component.css'],
})
export class AllDepartmentsComponent implements OnInit {
  adddepartment:boolean=false;
  state:string="";
  message:string="";
  deptname:string="";
  alertShown:boolean=false;
  departments=[];
  final_departs:Department[]=[];
  filter_text:string="";
  selected_depts:string[]=[];

  sortedData:Department[]=[];
  ngOnInit(): void {
    this.getAllDepts();

  }
  constructor(private alldeptservice:AlldepartmentService,private dialog:MatDialog){

  }





  getAllDepts(){
    this.alldeptservice.getAllDepts().subscribe(response=>{
      this.departments=response.departments;
   this.final_departs=this.departments.map(val=>({dept_desc:val["DEPT_DESC"],dept_id:val["DEPT_CODE"],emp_count:val["EMP_COUNT"]}));

   this.sortedData=this.final_departs.slice();
    });

  }


  openAppDepartmentDialog(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.hasBackdrop=true;
    dialogConfig.autoFocus=true;
    dialogConfig.width="300px";
    dialogConfig.height="250px";


    dialogConfig.data={
      id:1,
      title:"Department Name"
    };

 const dialogRef=   this.dialog.open(AddDepartmentComponent,dialogConfig);

 dialogRef.afterClosed().subscribe( (data)=>{
  this.deptname=data;
  if(this.deptname&&this.deptname.length>=1){
    console.log(this.deptname);
    this.addnewDept();
  }
});



    }

    addnewDept(){
      return this.alldeptservice.addNewDepartment(this.deptname).subscribe({
        next:(event:any)=>{
          console.log(event);
          if(event instanceof HttpErrorResponse){
            this.state="error";
            this.message=event.message;
            this.alertShown=true;
            console.log(this.message);
          }else{
            this.message=event.message;
            this.alertShown=true;
            console.log(this.message);
            this.ngOnInit();

          }
        }

      });


    }

    sortData(sort:Sort){
      const data=this.final_departs.slice();
      if(!sort.active||sort.direction===''){
        this.sortedData=data;
        return;
      }
      this.sortedData=data.sort((a,b)=>{
        const isAsc=sort.direction==='asc';
        switch(sort.active){
          case 'deptid':
            return compare(a.dept_id,b.dept_id,isAsc);
          case 'deptname':
            return compare(a.dept_desc!,b.dept_desc!,isAsc);
            case 'totalemp':
              return compare(a.emp_count!,b.emp_count!,isAsc) ;
              default:
                return 0;
        }
      });

    }

    updateCheckedList(dept_id:string){
      if(this.selected_depts.includes(dept_id)){
        this.selected_depts=this.selected_depts.filter(element=>element!=dept_id);

      }else{
        this.selected_depts.push(dept_id);
      }
    }


    openDeleteDialogDepartments(){
      const dialogConfig=new MatDialogConfig();
      dialogConfig.hasBackdrop=true;
      dialogConfig.autoFocus=true;
      dialogConfig.width="370px";
      dialogConfig.height="250px";
      dialogConfig.data={
        "dept_codes":this.selected_depts,
      };
      const dialogRef=this.dialog.open(DeleteDepartmentComponent,dialogConfig);

      dialogRef.afterClosed().subscribe( (data)=>{
        this.selected_depts=data;
        if(this.selected_depts.length>=1){
        this.deleteDepartments(this.selected_depts);

        }
      });
    }
    //for deleting selected departments
    deleteDepartments(selected_depts:string[]){
      this.alldeptservice.deleteDepartments(selected_depts).subscribe({
        next:(event:any)=>{
          if(event instanceof HttpErrorResponse){
            this.state="error";
            this.message=event.message;
            this.alertShown=true;
            console.log(this.message);
          }else{
            this.message=event.message;
            this.alertShown=true;
            this.selected_depts=[];
            console.log(this.message);
            this.ngOnInit();

          }
        }
      });
    }


  closeAlert(){
    this.alertShown=false;
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

