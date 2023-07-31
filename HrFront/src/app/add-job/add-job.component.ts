import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit{
  jobname: string="";
  form!: FormGroup;
  state:string="";
  message:string="";
  alertShown:boolean=false;

constructor(private fb:FormBuilder,private dialogRef:MatDialogRef<AddJobComponent>,@Inject (MAT_DIALOG_DATA)data:any){
  this.jobname=data.jobname;
}
  ngOnInit(): void {
this.form=this.fb.group(

  {jobname:this.jobname}

  );
  }

close() {
    this.dialogRef.close();
}
save(){
  this.dialogRef.close(this.form.value.jobname);
}
}
