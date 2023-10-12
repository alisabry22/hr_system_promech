import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllempComponent } from './allemp/allemp.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmptimeComponent } from './emptime/emptime.component';
import { SpliexcelComponent } from './spliexcel/spliexcel.component';
import { UploadSheetComponent } from './upload-sheet/upload-sheet.component';
import { UploadfileComponent } from './uploadfile/uploadfile.component';
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { AllDepartmentsComponent } from './all-departments/all-departments.component';
import { JobsComponent } from './jobs/jobs.component';
import { TimeReportComponent } from './time-report/time-report.component';
import { TransReportComponent } from './trans-report/trans-report.component';
import { LoginComponent } from './login/login.component';
import { HistoryempComponent } from './historyemp/historyemp.component';
const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  //{path:'',redirectTo:'dashboard',pathMatch:'full'},
  {path:'departments',component:AllDepartmentsComponent,},
  {path:'dashboard',component:DashboardComponent,},
  {path:'allemp',component:AllempComponent,},
  {path:'allemp/addemp',component:AddemployeeComponent,},
  {path:'emptime',component:EmptimeComponent,},
  {path:'splitexcel',component:SpliexcelComponent,},
  {path:'uploadsheet',component:UploadSheetComponent,},

  {path:'uploadfile',component:UploadfileComponent,},
  {path:'jobs',component:JobsComponent,},
  {path:'timereport',component:TimeReportComponent,},
  {path:'transreport',component:TransReportComponent,},
  {path:'history',component:HistoryempComponent,},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
