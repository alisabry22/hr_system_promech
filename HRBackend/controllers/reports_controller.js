

const oracleConnection = require("./oracle_connection");
GetAllTimeRepoData=async(req,res)=>{

    let connection=await oracleConnection();
    var get_time_Repo_query="select * from at_trans";

   const result=await connection.execute(get_time_Repo_query);
        connection.close();
        return res.send({state:"success",timerepo:result})
   

}



module.exports={GetAllTimeRepoData};