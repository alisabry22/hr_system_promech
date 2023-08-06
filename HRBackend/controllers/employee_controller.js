//const oracledb = require("oracledb");
const mysql = require("mysql");

const getAllEmployees = async (req, res) => {
  let connection;
  try {


    connection = mysql.createConnection({
      host: "localhost",
      password: "promech",
      database: "attend",
      user: "root",
      multipleStatements: true,
    });
    connection.connect();


    var get_all_emps_query = "select e.emp_name, e.card_id, j.job_desc,e.hire_date,e.dept_code,e.emp_status,d.dept_desc ,r.rule_desc from at_emps as  e left join at_dept d  on e.dept_code=d.dept_code left join at_rules r  on e.rule_no = r.rule_no left join at_jobs j on e.job_code=j.job_code where 1=1 ORDER BY card_id ASC";

    var get_all_depts_query = "select * from at_dept";
    connection.query(get_all_emps_query, function (err, result) {
      if (err) return res.send({ state: "error", message: err.message });
      connection.query(get_all_depts_query, function (err, result1) {
        if (err) return res.send({ state: "error", message: err.message });
        connection.end();
        return res.send({ state: "success", allemp: result, alldept: result1 });
      })


    });




  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }

}



const addNewEmployee = async (req, res) => {
  var empname = req.body.empname;
  var emptype = req.body.emptype;
  var department = req.body.department;
  var job = req.body.job;
  var anual_vactation = req.body.ordinary_vacation;
  var casual_vacation = req.body.casual_vacation;
  var hiredate = new Date(req.body.hiredate);
  var company_name = req.body.company_name;
  var cardId = req.body.card_id;
  let connection;
  try {

    connection = mysql.createConnection({
      host: "localhost",
      password: "promech",
      database: "attend",
      user: "root",
      multipleStatements: true,
    });
    connection.connect();


    var max_emp_no_query = "select ifnull(max(emp_no),0) as emp_no from at_emps";
    var insert_query = `INSERT INTO at_emps (card_id,emp_no,emp_name,hire_date,dept_code,job_code,rule_no,anual_days,casual_days,company_name,sect_code,emp_status) values(?,?,?,?,?,?,?,?,?,?,?,?)`;

    var emp_no = await new Promise((resolve) => {
      connection.query(max_emp_no_query, (err, res) => {
        resolve(res[0].emp_no);
      })
    });

    var values = [
      cardId,
      emp_no += 1,
      empname,
      hiredate,
      department,
      job,
      emptype == "Manager" ? 1 : 2,
      anual_vactation,
      casual_vacation,
      company_name,
      1,
      1,

    ];

    connection.query(insert_query, values, function (err, result) {
      if (err) return res.send({ state: "error", message: err.message });
      return res.send({ state: "success", message: "Succesfully Added Employee" });
    })

  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }

}

const getAllEmpTime = async (req, res) => {
  try {
    let connection;
    connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "promech",
      database: "attend",
    });
    var get_emp_time_query = "select * from at_emp_time";
    connection.query(get_emp_time_query, (err, result) => {
      if (err) return res.send({ state: "error", message: err.message });
     
      return res.send({ state: "success", emptime: result });
    });

  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }

}
const EditEmployee = async (req, res) => {
  let connection;
  empname = req.body.empname;
  departmentName = req.body.departmentName;
  role = req.body.role;
  emp_status = req.body.status;


  try {

    connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "promech",
      database: "attend"
    });

    rolecode = role == "Manager" ? "1" : "2";
    var get_dept_query = `select dept_code from at_dept where dept_desc=?`;


    var dept_Code = await new Promise(function (resolve, reject) {
      connection.query(get_dept_query, departmentName, function (err, result) {
        if (err) return reject(res.send({ state: "error", message: err.message }));
        return resolve(result[0].dept_code);

      })
    },);

    var updateQuery = "update at_emps set emp_name=? , dept_code=? ,rule_no=?,emp_status=? where emp_name=?";
    var binds = [empname, dept_Code, rolecode, emp_status, empname];
    connection.query(updateQuery, binds, function (err, result) {
      if (err) return res.send({ state: "error", message: err.message });
      connection.end();
      return res.send({ state: "success", message: "Successfully changed Employee Data" });
    });







  } catch (error) {
    console.log(error);
    return res.send({ state: "error", message: error });
  }
}

const EditEmpTime=async(req,res)=>{
  
   let connection;
 
  const{card_id,date,company_name,trans,remarks}=req.body;
 

  try {
   
      connection=mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"promech",
        database:"attend",
      });
        

      update_emp_query="update at_emp_time set  trans=? , remarks=? where card_id=? and company_name=? and date=?";

      var binds=[trans,remarks,card_id,company_name,date];
      return new Promise((resolve,reject)=>{
        connection.query(update_emp_query,binds,  (err,result)=>{
          if(err)return reject(res.send({state:"error",message:err.message}));
          updateAtTransOnEachEdit(card_id,company_name);
         //  updateAtTransOnEachEdit(card_id,company_name);
  
       
   
        });
      });
     

     
    


  } catch (error) {
    console.log(error);
  }
}

 function updateAtTransOnEachEdit(card_id,company_name){
  var total_trans=0;
  try {
    let connection=mysqlConnection();
    //once edit is done on single date of user call this function to calculate reports
    var select_emp_time_query='select * from at_emp_time where card_id=? and company_name=?';
   var empTime= new Promise((resolve)=>{
    connection.query(select_emp_time_query,[card_id,company_name],(err,result)=>{
      resolve(result);
    })   });
   console.log(empTime);
   var last_date=empTime[empTime.length-1].date.toString().split("-");
   for(let i=0; i<empTime.length;i++){
    if(empTime[i].trans.length!=0){
      total_trans+=parseInt(empTime[i].trans);
    }
   
   }
   console.log("trans amount",total_trans);
   

   var update_trans_for_emp='update at_trans set trans_amount=? where card_id=? and month=? and year=? and company_name=?';
   connection.query(update_trans_for_emp,[parseInt(total_trans),card_id,parseInt(last_date[1]),parseInt(last_date[0]),company_name.toString()],(err,result)=>{
    if(err)console.log(err.message);

   


   })

  } catch (error) {
    return error.message;
  }


}

function mysqlConnection(){
  return  mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"promech",
        database:"attend"
    });
}






module.exports = { getAllEmployees, addNewEmployee, getAllEmpTime, EditEmployee ,EditEmpTime};