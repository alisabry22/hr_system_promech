import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpTime } from 'shared/models/emptime';

@Component({
  selector: 'app-editemptime',
  templateUrl: './editemptime.component.html',
  styleUrls: ['./editemptime.component.css']
})
export class EditemptimeComponent implements OnInit {
  editEmpForm!:FormGroup;
  empname:string="";
  clock_in:string="";
  clock_out:string="";
  remarks:string="";
  trans:number;
  empTime:EmpTime;

  constructor(private fb:FormBuilder,private dialogRef:MatDialogRef<EditemptimeComponent>,@Inject (MAT_DIALOG_DATA)data:EmpTime){
    this.empTime=data;
    this.empname=data.emp_name!;
    this.clock_in=data.clock_in!;
    this.clock_out=data.clock_out!;
    this.remarks=data.remarks!;
    this.trans=data.trans_amt!;
  }
  ngOnInit(): void {
    this.editEmpForm=this.fb.group( {empname:this.empname,clock_in:this.clock_in,clock_out:this.clock_out,remarks:this.remarks,trans:this.trans});
  }

  close() {
    this.dialogRef.close(null);
}
save(){
  this.empTime.trans_amt=this.editEmpForm.value["trans"];
  this.empTime.remarks=this.editEmpForm.value["remarks"];


this.dialogRef.close(this.empTime);
}

}
