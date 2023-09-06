const oracleConnection = require("../controllers/oracle_connection");

function getAllEmployeesQuery(){
    return new Promise(async function(resolve,reject){
        let connection;
        try {
                connection=await oracleConnection();
                var sql_select_emp="select e.card_id,e.emp_name, j.job_desc, e.hire_date,e.dept_code,e.status,e.sect_code,d.dept_desc ,r.rule_desc from at_emps  e  left join at_dept d  on e.dept_code=d.dept_code left join at_rules r  on e.rule_no = r.rule_no left join at_jobs j on e.job_code=j.job_code where 1=1 ORDER BY card_id ASC";
                const result=await connection.execute(sql_select_emp);
                
                resolve(result.rows);

        } catch (error) {
            reject(error);
            console.log(error);
        }finally{
                if(connection){
                    try {
                            await connection.release();
                    } catch (error) {
                        console.error(e);
                    }
                }
        }
    })
}

function AddNewEmployeeHelper(card_id,empname,emptype,department,job,ordinary_vacation,casual_vacation,hire_date,company_name,sect_code){
    return new Promise(async function(resolve,reject){
        
       var max_emp_no=await GetMaxEmpNo();
    
       const insert_emp_query=`INSERT INTO at_emps  (card_id,emp_no,emp_name,hire_date,dept_code,job_code,rule_no,ordinary_days,casual_days,company_name,sect_code,status) values(:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11,:12)`;
        var binds=[
            card_id,
            max_emp_no += 1,
            empname,
            hire_date,
            department,
            job,
            emptype == "Manager" ? 1 : 2,
            ordinary_vacation,
            casual_vacation,
            company_name,
            sect_code=="Product Development"?1:"Manufacturing Solutions"?2:3,
            1,
            
        ];
        let connection;
        try {
             connection=await oracleConnection();
          const addEmpResult=await connection.execute(insert_emp_query,binds,{autoCommit:true});
     
                console.log(addEmpResult);
            resolve(addEmpResult.rowsAffected);
            
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

function GetMaxEmpNo(){
    return new Promise(async function(resolve,reject){
        let connection;
        const get_max_empNo="select nvl(max(emp_no),0) as emp_no from at_emps";
        try {
            
             connection=await oracleConnection();
          const result=await  connection.execute(get_max_empNo);
      
          resolve(result.rows[0][0]);
        } catch (error) {
                reject(error);
                console.log(error);
        }finally{
            if(connection){
                try {
                        await connection.release();
                } catch (error) {
                        console.log(error);
                }
            }
        }
    })
}

function GetAllEmpTime (){
    return new Promise(async function (resolve,reject){
        let connection;
        var get_emp_time_query = "select * from at_emp_time order by card_id ASC";
        try {
            
            connection=await oracleConnection();
         const result=await  connection.execute(get_emp_time_query);
     
         resolve(result.rows);
       } catch (error) {
               reject(error);
               console.log(error);
       }finally{
           if(connection){
               try {
                       await connection.release();
               } catch (error) {
                       console.log(error);
               }
           }
       }

    })
}

module.exports={getAllEmployeesQuery,AddNewEmployeeHelper,GetAllEmpTime};