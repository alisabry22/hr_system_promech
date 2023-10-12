import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddDepartmentComponent } from '../add-department/add-department.component';

@Component({
  selector: 'app-send-mails',
  templateUrl: './send-mails.component.html',
  styleUrls: ['./send-mails.component.css'],
})
export class SendMailsComponent implements OnInit {
  form!: FormGroup;
  month: string = '';
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({});
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    this.dialogRef.close();
  }
}
