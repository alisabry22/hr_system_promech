import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-department',
  templateUrl: './delete-department.component.html',
  styleUrls: ['./delete-department.component.css']
})
export class DeleteDepartmentComponent implements OnInit {
  dept_codes:String[]=[];
  ngOnInit(): void {

  }

  constructor(private dialogRef:MatDialogRef<DeleteDepartmentComponent>,@Inject (MAT_DIALOG_DATA)data:any){
    this.dept_codes=data.dept_codes;

  }

  closeDeleteDepartmentDialog(){
    this.dialogRef.close();
  }

  saveDeleteDepartmentDialog(){
    this.dialogRef.close(this.dept_codes);
  }
}
