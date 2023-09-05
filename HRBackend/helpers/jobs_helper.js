const oracleConnection = require("../controllers/oracle_connection");

function GetAllJobsQuery(){
    return new Promise(async function(resolve,reject){

        let connection;
        var get_jops_query="select distinct j.job_code ,j.job_desc,count(e.emp_name) as total_emp from at_jobs j left join at_emps e on e.job_code=j.job_code group by  j.job_code ,j.job_desc order by j.job_code ASC";
        try {
                connection=await oracleConnection();

              var result=await  connection.execute(get_jops_query);

              resolve(result.rows);
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
function AddNewJobToDb(jobname){
    return new Promise(async function(resolve,reject){

        let connection;
        var add_new_job_query="insert into at_jobs (job_code,job_desc) values (:1,:2)";
        try {
                var maxJobCode=await GetMaxJobCode();
               
                maxJobCode+=1;
                connection=await oracleConnection();

              var result=await  connection.execute(add_new_job_query,[maxJobCode,jobname],{autoCommit:true});

              resolve(result.rowsAffected);
            
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

function GetMaxJobCode(){
    return new Promise(async function(resolve,reject){
        var max_job_code="select nvl(max(job_code),0) as maxcode from at_jobs";
        let connection;
        try {
            connection=await oracleConnection();
    
         var result=  await connection.execute(max_job_code);

            resolve(result.rows[0][0]);
            
            
        } catch (error) {
                reject(error);
        }finally{
            if (connection){
                try {
                        await connection.release();
                } catch (error) {
                        console.error(error);
                }
            }
        }
    })
   
}

module.exports={GetAllJobsQuery,AddNewJobToDb};