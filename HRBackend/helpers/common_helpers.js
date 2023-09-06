const oracleConnection = require("../controllers/oracle_connection");

function GetDistinctDaysAtEmpTime(){
    return new Promise(async function (resolve,reject){
        let connection;
        var get_distinct_Days_count="select count (distinct date_day) as counter from at_emp_time";
        try {

            connection =await  oracleConnection();
            
            
            const result=await connection.execute(get_distinct_Days_count);
        
          
           resolve(result.rows[0][0]);
        } catch (error) {
        
                console.log("GetDistinctDays Error",error);
                reject(error);
        }finally{
            if(connection){
                try {
                    await connection.release();
                } catch (error) {
                        console.log("GetDistinctDays",error);
                }
            }
        }
   
    })
}

function GetAllEmpTimeWithHisRule(){
    return new Promise(async function(resolve,reject){
        let connection;
        try {
            var select_all_emp_time_query = 'SELECT emp_time.*,emp.rule_no FROM at_emp_time  emp_time left join at_emps emp on emp_time.card_id=emp.card_id and emp_time.company_name=emp.company_name';
                connection=await oracleConnection();

              var result=  await connection.execute(select_all_emp_time_query);
              
              resolve(result.rows);
        } catch (error) {
                reject(error);
        }finally{
            if(connection){
               try {
                await connection.release();
               } catch (error) {
                    console.log("GetAllEmpTimeWithHisRule",error);
               }
            }
        }
    })
}

module.exports={GetDistinctDaysAtEmpTime,GetAllEmpTimeWithHisRule};