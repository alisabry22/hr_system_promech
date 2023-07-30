import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllempComponent } from './allemp/allemp.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmptimeComponent } from './emptime/emptime.component';
import { SpliexcelComponent } from './spliexcel/spliexcel.component';
import { ReportsComponent } from './reports/reports.component';
import { UploadSheetComponent } from './upload-sheet/upload-sheet.component';
import { UploadfileComponent } from './uploadfile/uploadfile.component';
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { AllDepartmentsComponent } from './all-departments/all-departments.component';
import { AllemptimeComponent } from './allemptime/allemptime.component';
import { JobsComponent } from './jobs/jobs.component';
const routes: Routes = [
  {path:'',redirectTo:'dashboard',pathMatch:'full'},
  {path:'departments',component:AllDepartmentsComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'allemp',component:AllempComponent},
  {path:'allemp/addemp',component:AddemployeeComponent},
  {path:'emptime',component:EmptimeComponent},
  {path:'splitexcel',component:SpliexcelComponent},
  {path:'uploadsheet',component:UploadSheetComponent},
  {path:'reports',component:ReportsComponent},
  {path:'uploadfile',component:UploadfileComponent},
  {path:'AllEmpTime',component:AllemptimeComponent},
  {path:'jobs',component:JobsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
