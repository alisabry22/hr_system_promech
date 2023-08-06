
const mysql=require("mysql");
GetAllTimeRepoData=async(req,res)=>{

    let connection=mysqlConnection();
    var get_time_Repo_query="select * from at_trans";
    connection.query(get_time_Repo_query,(err,result)=>{
        if(err)return res.send({state:"error",message:err.message});
        connection.end();
        return res.send({state:"success",timerepo:result})
    });

}

 function mysqlConnection(){
  return  mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"promech",
        database:"attend"
    });
}

module.exports={GetAllTimeRepoData};