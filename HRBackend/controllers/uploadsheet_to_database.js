const oracledb=require("oracledb");
const xlsx=require("xlsx");
const process=require("child_process");

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
       
         
        xlsx.writeFileXLSX(newbook,"./sql/attend.xlsx");
        
    



      


        connection=await oracledb.getConnection({
            user:"ATTEND",
            password:"attend",
            connectString:"192.168.0.69:1521/xe",
                });
      var workbook=  xlsx.readFile("./sql/attend.xlsx");
            var sheet=workbook.Sheets[workbook.SheetNames[0]];
            exceldata=xlsx.utils.sheet_to_csv(sheet);
            //get file name 
            //create csv file from upload xlsx
            xlsx.writeFile(workbook,"./sql/attend.csv",{bookType:'csv'});
             truncateTable="truncate table AT_EMP_TIME drop storage";
             await connection.execute(truncateTable);
             command="sqlldr userid=attend/attend control=D:/hr_system/HrBackend/sql/at_emp_time.ctl log=D:/hr_system/HrBackend/sql/attendance.log skip=1";

           result=  process.exec(command);
     
        return res.send({state:"success",message:"Succesfully uploaded file to database"});
    } catch (error) {
        return res.send({state:"error",message:error.message});

    }
}
module.exports=uploadSheetToDatabase;