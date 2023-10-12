import { Pipe, PipeTransform } from "@angular/core";
import { EmpHistory } from "./emphistory";
@Pipe({
    name:"filteremphistory",
})
export class EmployeeHistorySearchPipe implements PipeTransform{
  transform(employees:EmpHistory[],searchText:string) {
    console.log("called");
    if(employees.length===0 || searchText===""){
      return employees;
    }else{

     return  employees.filter((emp)=>emp.emp_name?.toLowerCase().toString().startsWith(searchText.toLowerCase()));
    }  }

}
