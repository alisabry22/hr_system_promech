const oracledb=require("oracledb")

const getDashboardData=async(req,res)=>{

    let connection;
    try {
        
        connection=await oracledb.getConnection({
            user:"ATTEND",
            password:"attend",
            connectString:"192.168.0.69:1521/xe",
                });

                var gettotalEmps=await connection.execute("select count(*) as total_emp from at_emps");
                var getdepts=await connection.execute("select count(*) as total_dep from at_dept");
                gettotalEmps=gettotalEmps.rows[0]["TOTAL_EMP"];
                getdepts=getdepts.rows[0]["TOTAL_DEP"];
                connection.close();
                return res.send({state:"success",totalemp:gettotalEmps,totaldept:getdepts})
    } catch (error) {
        return res.send({state:"error",message:error.message});
    }
}

module.exports=getDashboardData;