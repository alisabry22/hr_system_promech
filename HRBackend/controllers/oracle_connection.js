const oracledb=require("oracledb");

 function oracleConnection() {
    return  oracledb.getConnection({
        user:"ATTEND",
        password:"attend",
        connectString:"192.168.0.69:1521/xe",
        
            });
  }

  module.exports=oracleConnection;