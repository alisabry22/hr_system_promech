import { Pipe, PipeTransform } from "@angular/core";
import { EmpTimeReport } from "shared/models/emp_time_report";
@Pipe({
    name:"filterTimeReport",
})
export class FilterTimeReportPipe implements PipeTransform{
  transform(employees:EmpTimeReport[],searchText:string) {

    if(employees.length===0 || searchText===""){
      return employees;
    }else{

     return  employees.filter((emp)=>emp.emp_name?.toLowerCase().toString().startsWith(searchText.toLowerCase()));
    }  }

}
