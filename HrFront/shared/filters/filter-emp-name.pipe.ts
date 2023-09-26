import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from 'shared/models/employee';

@Pipe({
  name: 'filterEmpName'
})
export class FilterEmpNamePipe implements PipeTransform {

  transform(emps : Employee[], empname: string): Employee[] {
    if(empname!="" && empname.length!=0){
      var subemps=emps.filter((val)=>val.employee_name.toLowerCase().toString().startsWith(empname.toLowerCase()));


     return subemps;
    }else{
      return emps;
    }
  }

}
