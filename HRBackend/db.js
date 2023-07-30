const oracledb=require("oracledb")
var mysql=require("mysql");

//oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
//oracle db

// async function run(){
//     let connection;
//     try {
     
//         connection=await oracledb.getConnection({
//     user:"ATTEND",
//     password:"attend",
//     connectString:"192.168.0.69:1521/xe",
//         });
    
//     console.log("connected");
        
//     } catch (error) {
//         console.log(error);
//     }finally{
//         if(connection){
//             try {
//                 connection.close();
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//     }
// }

//node db

async function run(){

    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:"promech",
        database:"attend",
    });

   try {
     connection.connect();
   } catch (error) {
        console.log(error.toString());
   }
}
module.exports=run;