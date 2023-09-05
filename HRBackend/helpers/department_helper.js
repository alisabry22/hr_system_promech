const oracleConnection = require("../controllers/oracle_connection");

function GetAllDepartmentsQuery(){
    return new Promise(async function(resolve,reject){

        var get_dept_query="select distinct d.dept_code ,d.dept_desc,count(e.emp_name) as emp_count from at_dept d left join at_emps e on e.dept_code=d.dept_code group by  d.dept_desc ,d.dept_code order by d.dept_code ASC";

        let connection;
        try {
                connection=await oracleConnection();
           const result= await connection.execute(get_dept_query);
         
           resolve(result.rows);

        } catch (error) {
                reject(error);
        }finally{

            if(connection){
                try {
                        connection.release();
                } catch (error) {
                        console.error(error); 
                    }
            }
        }

    })
}

module.exports={GetAllDepartmentsQuery};