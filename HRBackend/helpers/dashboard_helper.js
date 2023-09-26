const oracleConnection = require("../controllers/oracle_connection");
function GetEmployeeTotalCount(){
   
    return new Promise(async function(reslove,reject){
        var emp_count_query="select count(*) as total_emp from at_emps";

        let connection;
        try {
                connection=await oracleConnection();
                const result=await connection.execute(emp_count_query);
              
                reslove(result.rows[0][0]);
        } catch (error) {
                reject(error);
        }finally{
            if(connection){
                try {
                        await connection.release();
                } catch (error) {
                    console.error(error);
                }
            }
        }

    })
}
function GetDepartmentTotalCount(){
    return new Promise(async function(reslove,reject){
        var dept_count_query="select count(*) as total_dep from at_dept";

        let connection;
        try {
                connection=await oracleConnection();
                const result=await connection.execute(dept_count_query);
                reslove(result.rows[0][0]);
        } catch (error) {
                reject(error);
        }finally{
            if(connection){
                try {
                        await connection.release();
                } catch (error) {
                    console.error(error);
                }
            }
        }

    })
}
function GetJobsTotalCount(){
    return new Promise(async function(reslove,reject){
        var jobs_count_query="select count(*) as total_jobs from at_jobs";

        let connection;
        try {
                connection=await oracleConnection();
                const result=await connection.execute(jobs_count_query);
                reslove(result.rows[0][0]);
        } catch (error) {
                reject(error);
        }finally{
            if(connection){
                try {
                        await connection.release();
                } catch (error) {
                    console.error(error);
                }
            }
        }

    })
}

//select last 5 employees joined our company 
function GetLast5JoinedEmployees(){
    return new Promise(async function(reslove,reject){
        var last_5_emps_query="select e.*, d.dept_desc from at_emps e,at_dept d where e.status=1 and e.dept_code=d.dept_code  and rownum<=5 order by hire_date desc  ";

        let connection;
        try {
                connection=await oracleConnection();
                const result=await connection.execute(last_5_emps_query);
           
                reslove(result.rows);
        } catch (error) {
            console.log(error);
                reject(error);
        }finally{
            if(connection){
                try {
                        await connection.release();
                } catch (error) {
                    console.error(error);
                }
            }
        }

    })
}

function getTotalSections(){
    return new Promise(async function(resolve,reject){
        let connection;
        try {
            var emp_count_query="select count(*) as total_sect from at_sect";
            connection=await oracleConnection();

           const result= await connection.execute(emp_count_query);
          resolve(result.rows[0][0]);

        } catch (error) {
                reject(error);
        }finally{
            if(connection){
                try {
                    await connection.release();
                } catch (error) {
                        console.error(error);
                }
            }
        }
    })
}


module.exports={GetEmployeeTotalCount,GetDepartmentTotalCount,GetJobsTotalCount,GetLast5JoinedEmployees,getTotalSections};