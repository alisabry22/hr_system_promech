const oracleConnection = require("../controllers/oracle_connection");
const moment=require("moment");

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
            var select_all_emp_time_query = 'SELECT emp_time.*,emp.rule_no FROM at_emp_time  emp_time left join at_emps emp on emp_time.card_id=emp.card_id and emp_time.company_name=emp.company_name order by emp_time.card_id ,emp_time.company_name,emp_time.date_day asc';
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

function UpdateRemarksAtTrans(at_emp_times,card_id,company_name){
    return new Promise(async function(resolve,reject){
        let connection;
        let at_emp_time=[];
                 at_emp_time=at_emp_times;  
        var update_remarks_query =
"update at_transs set t_sick=:1,t_mission=:2,t_ordinary_vacation=:3,t_casual_vacation=:4,t_permission=:5,t_official=:6  where card_id=:7 and month=:8 and year=:9 and company_name=:10";

        try {
            connection=await oracleConnection();
           

            var total_Sick = 0;
            var total_ordinary = 0;
            var total_mission = 0;
            var total_casual = 0;
            var total_permission = 0;
            var total_official=0;
          
            for (let i = 0; i < at_emp_time.length; i++) {
              if (at_emp_time[i][8]!=null&&at_emp_time[i][8].length >= 1) {
                if (at_emp_time[i][8] === "Casual") {
                  total_casual += 1;
                } else if (at_emp_time[i][8] === "Ordinary") {
                  total_ordinary += 1;
                } else if (at_emp_time[i][8] === "Sick") {
                  total_Sick += 1;
                } else if (at_emp_time[i][8] === "Mission") {
                  total_mission += 1;
                } else if (at_emp_time[i][8] === "Permission") {
                  total_permission += 1;
                }
                else if (at_emp_time[i][8] === "official") {
                    total_official += 1;
                  }
              }
            }
          
            var last_date = moment.utc(at_emp_time[at_emp_time.length - 1][2]).format("DD/MM/YYYY").toString().split("/");
            var binds= [
                total_Sick,
                total_mission,
                total_ordinary,
                total_casual,
                total_permission,
                total_official,
                parseInt(card_id),
                parseInt(last_date[1]),
                parseInt(last_date[2]),
                company_name,
              ];
              
              const result=await connection.execute(update_remarks_query,binds,{autoCommit:true});
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

function UpdateTransAtTrans(at_emp_times,card_id,company_name){
    return new Promise(async function(resolve,reject){
        let connection;
        var total_trans = 0;
       
        var update_trans_for_emp = "update at_transs set trans_amount=:1 where card_id=:2 and month=:3 and year=:4 and company_name=:5";
        try {
            const at_emp_time=at_emp_times;
           
            var last_date = moment.utc(at_emp_time[at_emp_time.length - 1][2]).format("DD/MM/YYYY").toString().split("/");
        
            for (let i = 0; i < at_emp_time.length; i++) {
                
              if (at_emp_time[i][9]!=null&&(at_emp_time[i][9]).toString().length>=1) {
                total_trans += parseInt(at_emp_time[i][9]);
              }
            }
            var binds=[total_trans,parseInt(card_id),parseInt(last_date[1]),parseInt(last_date[2]),company_name];
            connection=await oracleConnection();
           const result=await connection.execute(update_trans_for_emp,binds,{autoCommit:true});
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

function GetSpecificEmployeeTimeFromAtEmpTime(card_id,company_name){
      //once edit is done on single date of user call this function to calculate reports
      var select_emp_time_query ="select * from at_emp_time where card_id=:1 and company_name=:2 order by date_day";
      let connection;
       return new Promise(async function(resolve,reject) {
        try {
            connection=await oracleConnection();
           const result=await connection.execute(select_emp_time_query,[card_id,company_name]);
           resolve(result.rows);
        } catch (error) {
                reject(error);
        }   finally{
            if(connection){
                try {
                    await connection.release();
                } catch (error) {
                        console.error(error);
                }
            }
        }
     
      });
}

module.exports={GetDistinctDaysAtEmpTime,GetAllEmpTimeWithHisRule,UpdateTransAtTrans,GetSpecificEmployeeTimeFromAtEmpTime,UpdateRemarksAtTrans}; 