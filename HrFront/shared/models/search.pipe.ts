
import {Pipe, PipeTransform} from '@angular/core'
import { Department } from './department';
@Pipe({
  name:"filterDepartment"
})
export class DepartmentSearch implements PipeTransform{
  transform(sortedData:Department[],filterText:string) {
    if(sortedData.length===0 || filterText===""){
      return sortedData;
    }else{
     return  sortedData.filter((dept)=>dept.dept_desc?.toLowerCase().toString().startsWith(filterText.toLowerCase()));
    }

  }


}
