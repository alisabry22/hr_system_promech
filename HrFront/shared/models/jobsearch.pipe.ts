import { Pipe, PipeTransform } from "@angular/core";
import { job } from "./job";
@Pipe({
    name:"filterjob",
})
export class JOBSearchPipe implements PipeTransform{
  transform(final_jobs:job[],searchText:string) {
    if(final_jobs.length===0 || searchText===""){
      return final_jobs;
    }else{
     return  final_jobs.filter((job)=>job.job_desc?.toLowerCase().toString().startsWith(searchText.toLowerCase()));
    }  }

}
