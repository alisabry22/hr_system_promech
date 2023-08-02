const mysql=require("mysql");
const xlsx=require("xlsx");
const fastcsv=require("fast-csv");
const fs=require("fs");
const moment=require("moment");
const uploadSheetToDatabase=async(req,res)=>{
    let connection;
    var files=req.files;
    try {
      
        if(files==undefined){
            return res.send({state:"error",message:"Please Add File"});
        }
        if(files.length!=3){
            return res.send({state:"error",message:"You Must upload only 3 files"});
        }
        
       var promech= xlsx.readFile("./sql/promech.xlsx");
       var penta3d=xlsx.readFile("./sql/penta3d.xlsx");
       var promech12=xlsx.readFile("./sql/promech12.xlsx");
        //get sheets of promech and  promech12 and penta3d 
       var promechsheet=promech.Sheets[promech.SheetNames[0]];
       var penta3dsheet=penta3d.Sheets[penta3d.SheetNames[0]];
       var promech12sheet=promech12.Sheets[promech12.SheetNames[0]];

    var newbook=xlsx.utils.book_new();
   
    
 
        var promechexcelJson=xlsx.utils.sheet_to_json(promechsheet);
        var cardId;
        //get last card id of promech data employees 
  cardId=  promechexcelJson[promechexcelJson.length-1]["AC-No."];
  cardId++;
 
       var  penta3dData=xlsx.utils.sheet_to_json(penta3dsheet);
       var  promech12Data=xlsx.utils.sheet_to_json(promech12sheet);


//   //change ["AC-No"] to ["AC-No."]
// for(let i=0 ; i<penta3dData.length; i++){
//     var obj=Object(penta3dData[i]);
//   obj={"AC-No.":"",...obj};
//   delete(obj["AC-No"]);
//  penta3dData[i]=obj;
//  }
//    //add card id to penta3d to prevent null values while adding to database
//     for ( let i=1;i<penta3dData.length ; i++)
// {   
//     penta3dData[i-1]["AC-No."]=cardId;
//     if(penta3dData[i]["Name"]==penta3dData[i-1]["Name"]){
//         penta3dData[i]["AC-No."]=cardId;
//     }else{
//         cardId++;
//         penta3dData[i]["AC-No."]=cardId;
//     }
// }
// cardId++;

// for(let i=0 ; i<promech12Data.length; i++){
//     var obj=Object(promech12Data[i]);
//     obj={"AC-No.":"",...obj};
//     delete(obj["AC-No"]);
//     promech12Data[i]=obj;
   
 
//  }
// // add card id to promech to prevent null values while adding to database
// for ( let i=1;i<promech12Data.length ; i++)
// {
   
//     promech12Data[i-1]["AC-No."]=cardId;
//     if(promech12Data[i]["Name"]==promech12Data[i-1]["Name"]){
//         promech12Data[i]["AC-No."]=cardId;
//     }else{
//         cardId++;
//         promech12Data[i]["AC-No."]=cardId;
//     }
// }
// cardId=0;
   
 
       

let penta3daoe=[];
let promech12aoe=[];
      for(let key of penta3dData){
        penta3daoe.push(Object.values(key));
     
      }
      for(let key of promech12Data){
        penta3daoe.push(Object.values(key));
     
      }
      
         //add data of penta3d and promech12 to promech
         xlsx.utils.sheet_add_aoa(promechsheet,penta3daoe,{origin:-1});
         xlsx.utils.sheet_add_aoa(promechsheet,promech12aoe,{origin:-1});

         xlsx.utils.book_append_sheet(newbook,promechsheet,"promech");
         //manuplate date as date
         var sheet=  manuplateDate(newbook.Sheets[newbook.SheetNames[0]]);
         var latest_book=xlsx.utils.book_new();
         xlsx.utils.book_append_sheet(latest_book,sheet,"promech");
             
        xlsx.writeFileXLSX(latest_book,"./sql/attend.xlsx");
               

        
    



      


        connection= mysql.createConnection({
            user:"root",
            host:"localhost",
            password:"promech",
            database:"attend",
                });
      var workbook=  xlsx.readFile("./sql/attend.xlsx",{cellDates:true});
            
            trunc_query="truncate table at_emp_time";

                check_missing_employees_query='select distinct emp.emp_name from at_emp_time as emp where not  exists (select null from at_emps emp2 where emp2.card_id=emp.card_id  and emp2.company_name=emp.company_name)';
        
            insert_query="insert into at_emp_time (card_id,emp_name,date,clock_in,clock_out,late,early,absent,remarks,trans,company_name) values ?";

      


            //create csv file from upload xlsx
            xlsx.writeFile(workbook,"./sql/attend.csv",{bookType:'csv'});
            let stream=fs.createReadStream("./sql/attend.csv");
      
            let csvData=[];
            let csvStream=fastcsv.parse().on("data",function(data){
                csvData.push(data);
            
            }).on("end",function(){
                csvData.shift();
            connection.query(trunc_query,function(err,result){
                if(err)  return res.send({state:"error",message:err.message});
                connection.query(insert_query,[csvData],function(err,result1){
                    if(err) return res.send({state:"error",message:err.message});
                    connection.end();
                    return res.send({state:"success",message:"Successfully uploaded data"});
                  
                                    
                })

            });

                
            });
            stream.pipe(csvStream);
            
            
          
         
     
    } catch (error) {
        console.log(error);
        return res.send({state:"error",message:error.message});

    }
}

function manuplateDate(worksheet){
   
var excelData=xlsx.utils.sheet_to_json(worksheet);
for (let i=0 ;i<excelData.length ;i++){
   var obj=Object(excelData[i]);
    var full_date=new Date(obj["Date"]);
    
    obj["Date"]=full_date.toISOString().slice(0,10);

}
return xlsx.utils.json_to_sheet(excelData);
}

async function calculateEmpData(){
    
    let connection=mysql.createConnection({
        host:"localhost",
        database:"attend",
        user:"root",
        password:"promech",
    });

    var get_emp_time_qury="select * from at_emp_time";

    //get emp time
    var result_emp_time=await new Promise((resolve,reject)=>{
        connection.query(get_emp_time_qury,(err,result)=>{
            if(err) reject(err.message);
            resolve(result);
        })
    });
    var emp_count=0;
    var at_trans=[];
    for (let i=0 ; i<result_emp_time.length ; i++){
        let clock_in=result_emp_time[i].clock_in.toString();
        if(clock_in.length===5){
            var t1=moment(result_emp_time[i].clock_in,"hh:mm");
            var t2=moment("09:10","hh:mm");
            var t3=moment(t2.diff(t1),"hh:mm");
            console.log(`${t3.hours()}:${t3.minutes()}`);
         
        }
        // else{
        //     at_trans.push("");
        // }

 
    }
    console.log(at_trans);
 

}

module.exports=uploadSheetToDatabase;