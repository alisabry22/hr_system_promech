import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {

  departmentName: string="";
  form!: FormGroup;
  state:string="";
  message:string="";
  alertShown:boolean=false;

constructor(private fb:FormBuilder,private dialogRef:MatDialogRef<AddDepartmentComponent>,@Inject (MAT_DIALOG_DATA)data:any){
  this.departmentName=data.departmentName;
}
  ngOnInit(): void {
this.form=this.fb.group(

  {departmentName:this.departmentName}

  );
  }

close() {
    this.dialogRef.close();
}
save(){
  this.dialogRef.close(this.form.value.departmentName);
}


}
