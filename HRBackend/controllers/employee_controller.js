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
    var get_emp_time_query = "select * from at_emp_time ORDER BY (CAST(card_id as integer)) ASC";
    var emptime = await new Promise((resolve) => {
      connection.query(get_emp_time_query, (err, result) => resolve(result));
    })

    return res.send({ state: "success", emptime: emptime.rows });
  } catch (error) {
    console.log(error);
    return res.send({ state: "error", message: error.message });
  }

}
const EditEmployee = async (req, res) => {
  let connection;
  empname = req.body.empname;
  departmentName = req.body.departmentName;
  role = req.body.role;
  emp_status=req.body.status;


  try {

    connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "promech",
      database: "attend"
    });

    rolecode = role == "Manager" ? "1" : "2";
    var get_dept_query = `select dept_code from at_dept where dept_desc=?`;
   

    var dept_Code = await new Promise(function(resolve,reject){
      connection.query(get_dept_query,departmentName,function(err,result){
        if(err) return reject(res.send({state:"error",message:err.message}));
          return resolve(result[0].dept_code);
        
      })
    },);
   
    var updateQuery = "update at_emps set emp_name=? , dept_code=? ,rule_no=?,emp_status=? where emp_name=?";
    var binds = [empname, dept_Code, rolecode,emp_status,empname];
     connection.query(updateQuery, binds,function(err,result){
      if(err)return res.send({state:"error",message:err.message});
      connection.end();
      return res.send({ state: "success", message: "Successfully changed Employee Data" });
    });
   

    




  } catch (error) {
    console.log(error);
    return res.send({ state: "error", message: error });
  }
}






module.exports = { getAllEmployees, addNewEmployee, getAllEmpTime, EditEmployee };