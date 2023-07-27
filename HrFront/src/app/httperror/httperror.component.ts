import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-httperror',
  templateUrl: './httperror.component.html',
  styleUrls: ['./httperror.component.css']
})
export class HttperrorComponent {
  constructor( private dialogRef: MatDialogRef<HttperrorComponent> ){}
  closeDialog() {
    this.dialogRef.close();
  }
}
