//const oracledb=require("oracledb")
const mysql=require("mysql");
const getDashboardData=async(req,res)=>{

    let connection;
    try {
        connection= mysql.createConnection({
        host:"localhost",
        password:"promech",
        database:"attend",
        user:"root",
        multipleStatements:true,
        });

        connection.connect();
        
        // connection=await oracledb.getConnection({
        //     user:"ATTEND",
        //     password:"attend",
        //     connectString:"192.168.0.69:1521/xe",
        //         });

                var sql="select count(*) as total_emp from at_emps;select count(*) as total_dep from at_dept";
                 connection.query(sql,function(err,results,fields){
                    if(err)return res.send({state:"error",message:err});
              

                    return res.send({state:"success",totalemp:results[0][0].total_emp,totaldept:results[1][0].total_dep});


                    
                });
                
               
                connection.end();
                
               

    } catch (error) {
        return res.send({state:"error",message:error.message});
    }
}

module.exports=getDashboardData;