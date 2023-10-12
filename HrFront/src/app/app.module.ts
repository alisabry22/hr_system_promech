import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AllempComponent } from './allemp/allemp.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SpliexcelComponent } from './spliexcel/spliexcel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmptimeComponent } from './emptime/emptime.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { UploadfileComponent } from './uploadfile/uploadfile.component';
import { UploadSheetComponent } from './upload-sheet/upload-sheet.component';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { SublevelMenuComponent } from './sublevel-menu.component';
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AllDepartmentsComponent } from './all-departments/all-departments.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AddDepartmentComponent } from './add-department/add-department.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import { DepartmentSearch } from 'shared/models/search.pipe';
import { EditemptimeComponent } from './editemptime/editemptime.component';
import { EmployeeSearchPipe } from 'shared/models/employeesearch.pipe';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { EditempComponent } from './editemp/editemp.component';
import {MatSelectModule} from '@angular/material/select';
import { HttperrorComponent } from './httperror/httperror.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { DeleteDepartmentComponent } from './delete-department/delete-department.component';
import{MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { JobsComponent } from './jobs/jobs.component';
import { JOBSearchPipe } from 'shared/models/jobsearch.pipe';
import { AddJobComponent } from './add-job/add-job.component';
import {MatIconModule} from '@angular/material/icon';
import { TimeReportComponent } from './time-report/time-report.component';
import { TransReportComponent } from './trans-report/trans-report.component';
import { FilterTimeReportPipe } from 'shared/filters/filter_report_empTime';
import{FilterEmpNamePipe} from  'shared/filters/filter-emp-name.pipe';
import{FilterDepartmentPipe} from  'shared/filters/filter_department_name.pipe';
import {DatePipe} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import { TableModule } from 'primeng/table';
import { LoginComponent } from './login/login.component';
import { authGuard } from './services/auth.guard';
import { AuthInterceptor } from './services/authinterceptor';
import { EmployeeHistorySearchPipe } from 'shared/models/emp_history.pipe';
import { HistoryempComponent } from './historyemp/historyemp.component';
import { SendMailsComponent } from './send-mails/send-mails.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AllempComponent,
    BodyComponent,
    SidenavComponent,
    SpliexcelComponent,
    DashboardComponent,

    EmptimeComponent,
    UploadfileComponent,
    UploadSheetComponent,
    SublevelMenuComponent,
    AddemployeeComponent,
    AllDepartmentsComponent,
    AddDepartmentComponent,
    DepartmentSearch,
    EditemptimeComponent,
    EmployeeSearchPipe,
    EditempComponent,
    HttperrorComponent,
    DeleteDepartmentComponent,
    JobsComponent,
    JOBSearchPipe,
    AddJobComponent,
    TimeReportComponent,
    TransReportComponent,
    FilterTimeReportPipe,
    FilterEmpNamePipe,
    FilterDepartmentPipe,
    LoginComponent,
    HistoryempComponent,
    EmployeeHistorySearchPipe,
    SendMailsComponent


   // filterDateTimeReport,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    DatePipe,
    ButtonModule,
    TableModule






  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
