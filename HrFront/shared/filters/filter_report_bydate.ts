// import { Pipe, PipeTransform } from "@angular/core";
// import { EmpTimeReport } from "shared/models/emp_time_report";
// @Pipe({
//     name:"filterDateTimeReport",
// })
// export class filterDateTimeReport implements PipeTransform{
//   transform(employees:EmpTimeReport[],startDate:string,endDate:string) {

//     if(startDate.length !=0 && endDate.length!=0){
//       console.log("emps.length,",employees);
//     var count_months=  getDifferenceInMonths(startDate,endDate);
//        var startDateSplit=startDate.split("-");
//        var endDateSplit=endDate.split("-");


//        var emps=employees.filter((emp)=>(((emp.month!>=parseInt(startDateSplit[0]))&&(emp.year!>=parseInt(startDateSplit[1])))&&((emp.month!<=parseInt(endDateSplit[0]))&&(emp.year!<=parseInt(endDateSplit[1])))));

//      return  calculateAllEmps(emps,count_months==0?1:count_months);

//     }else{

//      return  employees;
//     }  }



// }
// // function getDifferenceInMonths(startDate:string,endDate:string){

// //  var startDatesplit= startDate.split("-");
// //  var endDateSplit=endDate.split("-");

// // var count_months=(parseInt(endDateSplit[0])-parseInt(startDatesplit[0]))+(12*(parseInt(endDateSplit[1])-parseInt(startDatesplit[1])));
// //  return count_months;


// // }

// // function calculateAllEmps(emps:EmpTimeReport[],count_months:number){
// //   var total_repo:EmpTimeReport[]=[];
// //   var total_late_in_hours=0;
// //   var total_attend_in_hours=0;
// //   var total_attend_in_minutes=0;
// //   var total_mission=0;
// //   var ordinary_vacation=0;
// //   var casual_vacation=0;
// //   var tpermission=0;
// //   var total_absent=0;
// //   var t_trans=0;
// //   var total_late_in_mins=0;
// //       for(let i=0 ;i<emps.length; i++){
// //         total_absent=emps[i].total_absent?parseInt(emps[i].total_absent!):0;

// //         var t_late1=emps[i].total_late?.split(":");
// //         var t_attend1=emps[i].total_attend?.split(":");
// //         total_attend_in_hours=parseInt(t_attend1![0]);
// //         total_attend_in_minutes=parseInt(t_attend1![1]);
// //         total_late_in_hours=parseInt(t_late1![0]);
// //         total_late_in_mins=parseInt(t_late1![1]);
// //         t_trans=emps[i].trans_amount!=null?parseInt(emps[i].trans_amount!):0;

// //         total_mission=emps[i].total_mission??0;
// //         ordinary_vacation=emps[i].total_oridinary_vacation??0;
// //         casual_vacation=emps[i].total_casual_vacation??0;
// //         tpermission=emps[i].total_permission??0;
// //           var index= total_repo.findIndex(temp=>(temp.cardId===emps[i].cardId)&&(temp.company_name===emps[i].company_name));


// //           if(index==-1){
// //             for(let k=i+1 ;k<emps.length ; k++){


// //               if(emps[i].cardId===emps[k].cardId && emps[i].company_name===emps[k].company_name){
// //                 var t_late2=emps[k].total_late?.split(":");
// //                 var t_attend2=emps[k].total_attend?.split(":");
// //                 total_attend_in_hours+=parseInt(t_attend2![0]);
// //                 total_attend_in_minutes+=parseInt(t_attend2![1]);
// //                 total_late_in_hours+=parseInt(t_late2![0]);
// //                 total_late_in_mins+=parseInt(t_late2![1]);

// //                 total_absent+=emps[k].total_absent?parseInt(emps[k].total_absent!):0;
// //                 total_mission+=emps[k].total_mission??0;

// //                 ordinary_vacation+=emps[k].total_oridinary_vacation??0;
// //                 casual_vacation+=emps[k].total_casual_vacation??0;
// //                 tpermission+=emps[k].total_permission??0;
// //                 t_trans+=emps[k].trans_amount!=null?parseInt(emps[k].trans_amount!):0;


// //             }


// //             }
// //             const minutes=total_late_in_mins%60;
// //             const hours=Math.floor(total_late_in_mins/60);
// //             total_late_in_hours+=hours;

// //             const t_attend_minutes=total_attend_in_minutes%60;
// //             const t_attend_hours=Math.floor(total_attend_in_minutes/60);
// //             total_attend_in_hours+=t_attend_hours;



// //             //append each employee in the new array
// //             emps[i].month=count_months;
// //             emps[i].trans_amount=t_trans.toString();
// //             emps[i].total_attend=`${total_attend_in_hours}:${t_attend_minutes}`;
// //             emps[i].total_late=`${total_late_in_hours}:${minutes}`
// //             emps[i].total_absent=total_absent.toString();
// //             emps[i].total_casual_vacation=casual_vacation;
// //             emps[i].total_permission=tpermission;
// //             emps[i].total_oridinary_vacation=ordinary_vacation;
// //             emps[i].total_mission=total_mission;

// //             total_repo.push(emps[i]);




// //             total_late_in_hours=0;
// //             total_attend_in_minutes=0;
// //             total_attend_in_minutes=0;
// //             total_absent=0;
// //             total_mission=0;
// //             casual_vacation=0;
// //             tpermission=0;
// //             ordinary_vacation=0;

// //            }





// //       }

// //       console.log("total_repo",total_repo);

// //       return total_repo;


// // }

// function calculateTotalAbsent(){

// }

