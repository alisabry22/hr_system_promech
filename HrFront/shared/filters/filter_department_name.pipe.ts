import { Pipe, PipeTransform } from '@angular/core';
import { Department } from 'shared/models/department';

@Pipe({
  name: 'FilterDepartmentPipe'
})
export class FilterDepartmentPipe implements PipeTransform {

  transform(depts : Department[],deptname: string): Department[] {
    console.log(depts);

    if(deptname!="" && deptname.length!=0){

      var subdepts=depts.filter((dept)=>dept.dept_desc.toLowerCase().toString().startsWith(deptname.toLowerCase()));
     return subdepts;
    }else{
      return depts;
    }
  }

}
