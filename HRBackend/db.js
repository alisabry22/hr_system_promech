const oracledb=require("oracledb")
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run(){
    let connection;
    try {
     
        connection=await oracledb.getConnection({
    user:"ATTEND",
    password:"attend",
    connectString:"192.168.0.69:1521/xe",
        });
    
    console.log("connected");
        
    } catch (error) {
        console.log(error);
    }finally{
        if(connection){
            try {
                connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
}
module.exports=run;