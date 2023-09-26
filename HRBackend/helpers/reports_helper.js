const oracleConnection = require("../controllers/oracle_connection");

function GetAllTimeReport(){
    return new Promise(async function(resolve,reject){
        let connection;
        var get_time_Repo_query="select t.*, d.dept_desc department_Description ,s.sect_desc from AT_TRANSS t, AT_EMPS e,AT_DEPT d , at_sect s where 1=1 and t.card_id=e.card_id(+) and t.company_name=e.company_name(+) and e.dept_code=d.dept_code(+)  and e.sect_code=s.sect_code(+) order by t.card_id";
        try {
             connection=await oracleConnection();
             
           const result= await connection.execute(get_time_Repo_query);

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

module.exports={GetAllTimeReport};