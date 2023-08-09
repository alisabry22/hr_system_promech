import { Pipe, PipeTransform } from "@angular/core";
import { EmpTimeReport } from "shared/models/emp_time_report";
@Pipe({
    name:"filterDateTimeReport",
})
export class filterDateTimeReport implements PipeTransform{
  transform(employees:EmpTimeReport[],startDate:string,endDate:string) {
    
    if(startDate.length !=0 && endDate.length!=0){
       var startDateSplit=startDate.split("-");
       var endDateSplit=startDate.split("-");
      return employees.filter((emp)=>(((emp.month!>=parseInt(startDateSplit[0]))&&(emp.year!>=parseInt(startDateSplit[1])))&&((emp.month!<=parseInt(endDateSplit[0]))&&(emp.year!<=parseInt(endDateSplit[1])))));
    }else{
      
     return  employees;
    }  }

}
