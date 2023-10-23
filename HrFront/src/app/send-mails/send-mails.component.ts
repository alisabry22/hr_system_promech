import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddDepartmentComponent } from '../add-department/add-department.component';
import { EmployeeserviceService } from '../services/employeeservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
@Component({
  selector: 'app-send-mails',
  templateUrl: './send-mails.component.html',
  styleUrls: ['./send-mails.component.css'],
})
export class SendMailsComponent implements OnInit {
  form!: FormGroup;
  month: string = `Month:${
    new Date().getMonth() + 1
  } - Year:${new Date().getFullYear()}`;
  from: string = '';
  cc: string = '';
  title: string = '';
  body: string = '';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: string[] = [];
  selected_emails: string[] = [];
  filteredEmails: Observable<string[]>;
  @ViewChild('emailInput')
  emailInput!: ElementRef<HTMLInputElement>;
  constructor(
    private fb: FormBuilder,
    private empService: EmployeeserviceService,
    private dialogRef: MatDialogRef<AddDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.form = this.fb.group({
      month: this.month,
      from: this.from,
      cc: this.cc,
      title: this.title,
      body: this.body,
    });
    this.filteredEmails = this.form.controls['cc'].valueChanges.pipe(
      startWith(null),
      map((email: string | null) =>
        email ? this._filter(email) : this.emails.slice()
      )
    );
    console.log('this.filtered Emails', this.filteredEmails);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selected_emails.push(event.option.viewValue);
    this.emailInput.nativeElement.value = '';
    this.form.patchValue({ cc: null });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toString().toLowerCase();

    return this.emails.filter((email) =>
      email.toString().toLowerCase().includes(filterValue)
    );
  }

  ngOnInit(): void {
    this.loadEmailsFromDb();
  }
  loadEmailsFromDb() {
    this.empService.loadAllEmailsFromDb().subscribe({
      next: (event: any) => {
        this.emails = event.emails;
      },
      error: (event: any) => {
        if (event instanceof HttpErrorResponse) {
          console.log(event);
        }
      },
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our email
    if (value) {
      this.selected_emails.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.form.patchValue({ cc: null });
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    this.dialogRef.close({ form: this.form.value, cc: this.selected_emails });
  }
  remove(email: string): void {
    console.log('remove called ', email);

    const index = this.selected_emails.indexOf(email);
    if (index >= 0) {
      this.selected_emails.splice(index, 1);
    }
  }
}
