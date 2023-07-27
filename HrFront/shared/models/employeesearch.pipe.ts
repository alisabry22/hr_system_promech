import { Pipe, PipeTransform } from "@angular/core";
import { EmpTime } from "./emptime";
@Pipe({
    name:"filteremp",
})
export class EmployeeSearchPipe implements PipeTransform{
  transform(employees:EmpTime[],searchText:string) {
    console.log("called");
    if(employees.length===0 || searchText===""){
      return employees;
    }else{
      console.log(searchText);
     return  employees.filter((emp)=>emp.emp_name?.toLowerCase().toString().startsWith(searchText.toLowerCase()));
    }  }

}
