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
        timezone:'utc',
        });

        connection.connect();
        

                var sql="select count(*) as total_emp from at_emps;select count(*) as total_dep from at_dept;select count(*) as total_jobs from at_jobs;select e.*, d.dept_desc from at_emps e,at_dept d where emp_status=1 and e.dept_code=d.dept_code  order by hire_date desc limit 5;select count(*) as totalsect from at_sect";
                 connection.query(sql,function(err,results,fields){
                    if(err)return res.send({state:"error",message:err});
                    connection.end();
                   
                    return res.send({state:"success",totalemp:results[0][0].total_emp,totaldept:results[1][0].total_dep,totaljob:results[2][0].total_jobs,latest_emps:results[3],totalsect:results[4][0].totalsect});


                    
                });
                
               
              
                
               

    } catch (error) {
        return res.send({state:"error",message:error.message});
    }
}

module.exports=getDashboardData;