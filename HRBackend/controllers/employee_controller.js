const { GetAllDepartmentsQuery } = require("../helpers/department_helper");
const {
  getAllEmployeesQuery,
  AddNewEmployeeHelper,
  GetAllEmpTime,
} = require("../helpers/employee_helper");
const oracleConnection = require("./oracle_connection");

const getAllEmployees = async (req, res) => {
  
  try {
    var emps_result = await getAllEmployeesQuery();
    var depts_result = await GetAllDepartmentsQuery();
    res.send({ state: "success", allemp: emps_result, alldept: depts_result });
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};

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
  var sect_code = req.body.sect_code;
  let connection;
  try {
    const addResult = await AddNewEmployeeHelper(
      cardId,
      empname,
      emptype,
      department,
      job,
      anual_vactation,
      casual_vacation,
      hiredate,
      company_name,
      sect_code
    );
    console.log("add Emp Result",addResult.rows);

    return res.send({state:"success",message:"successfully added Employeee"});
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};
//get all employee time and return result back to front end
const getAllEmpTime = async (req, res) => {
  try {

   
    var result=await GetAllEmpTime();

      return res.send({ state: "success", emptime: result });
 
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};


const EditEmployee = async (req, res) => {
  let connection;
  empname = req.body.empname;
  departmentName = req.body.departmentName;
  role = req.body.role;
  emp_status = req.body.status;

  try {
    connection = oracleConnection();
    rolecode = role == "Manager" ? "1" : "2";
    var get_dept_query = `select dept_code from at_dept where dept_desc=?`;

    var dept_Code = await new Promise(function (resolve, reject) {
      connection.execute(
        get_dept_query,
        departmentName,
        function (err, result) {
          if (err)
            return reject(res.send({ state: "error", message: err.message }));
          return resolve(result[0].dept_code);
        }
      );
    });

    var updateQuery =
      "update at_emps set emp_name=? , dept_code=? ,rule_no=?,emp_status=? where emp_name=?";
    var binds = [empname, dept_Code, rolecode, emp_status, empname];
    connection.execute(updateQuery, binds, function (err, result) {
      if (err) return res.send({ state: "error", message: err.message });
      connection.end();
      return res.send({
        state: "success",
        message: "Successfully changed Employee Data",
      });
    });
  } catch (error) {
    console.log(error);
    return res.send({ state: "error", message: error });
  }
};

const EditEmpTime = async (req, res) => {
  let connection;

  const { card_id, date, company_name, trans, remarks } = req.body;

  try {
    connection = oracleConnection();

    update_emp_query =
      "update at_emp_time set  trans=? , remarks=? where card_id=? and company_name=? and date=?";

    var binds = [trans, remarks, card_id, company_name, date];
    new Promise((resolve, reject) => {
      connection.execute(update_emp_query, binds, (err, result) => {
        if (err) {
          console.log(err);
          connection.end();
          reject(err);
        } else {
          resolve(result);
        }
      });
    }).then((val) => {
      console.log("from edit_emp_time");
      updateAtTransOnEachEdit(card_id, company_name, connection);
      return res.send({
        state: "success",
        message: "Successfully Edited Employee",
      });
    });
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};

async function updateAtTransOnEachEdit(card_id, company_name, conn) {
  var total_trans = 0;
  try {
    let connection = conn;
    //once edit is done on single date of user call this function to calculate reports
    var select_emp_time_query =
      "select * from at_emp_time where card_id=? and company_name=?";
    var empTime = await new Promise((resolve) => {
      connection.execute(
        select_emp_time_query,
        [card_id, company_name],
        (err, result) => {
          if (err) {
            conn.close();
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    var last_date = empTime[empTime.length - 1].date.toString().split("-");
    for (let i = 0; i < empTime.length; i++) {
      if (empTime[i].trans.length != 0) {
        total_trans += parseInt(empTime[i].trans);
      }
    }

    var update_trans_for_emp =
      "update at_trans set trans_amount=? where card_id=? and month=? and year=? and company_name=?";
    new Promise((resolve, reject) => {
      connection.execute(
        update_trans_for_emp,
        [
          parseInt(total_trans),
          card_id,
          parseInt(last_date[1]),
          parseInt(last_date[0]),
          company_name.toString(),
        ],
        (err, result) => {
          if (err) {
            conn.close();
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    })
      .then((val) => {
        console.log("from at_trans");
        update_remarks_at_trans(empTime, card_id, company_name, conn);
      })
      .catch((err) => console.log(err));
  } catch (error) {
    return error.message;
  }
}

function update_remarks_at_trans(at_emps, card_id, company_name, conn) {
  let connection = conn;

  var total_Sick = 0;
  var total_ordinary = 0;
  var total_mission = 0;
  var total_casual = 0;
  var total_permission = 0;

  for (let i = 0; i < at_emps.length; i++) {
    if (at_emps[i].remarks.length >= 1) {
      if (at_emps[i].remarks === "Casual") {
        total_casual += 1;
      } else if (at_emps[i].remarks === "Ordinary") {
        total_ordinary += 1;
      } else if (at_emps[i].remarks === "Sick") {
        total_Sick += 1;
      } else if (at_emps[i].remarks === "Mission") {
        total_mission += 1;
      } else if (at_emps[i].remarks === "Permission") {
        total_permission += 1;
      }
    }
  }

  var last_date = at_emps[at_emps.length - 1].date.toString().split("-");

  var update_remarks_query =
    "update at_trans set t_sick=?,t_mission=?,t_ordinary_vacation=?,t_casual_vacation=?,t_permission=?  where card_id=? and month=? and year=? and company_name=?";

  new Promise((resolve, reject) => {
    connection.query(
      update_remarks_query,
      [
        total_Sick,
        total_mission,
        total_ordinary,
        total_casual,
        total_permission,
        card_id,
        parseInt(last_date[1]),
        parseInt(last_date[0]),
        company_name,
      ],
      (err, result) => {
        if (err) {
          console.log(err.sql);
          reject(new Error(err));
        } else {
          resolve(result);
        }
      }
    );
  })
    .then((val) => console.log("update remarks"))
    .catch((err) => console.log(err));
}

module.exports = {
  getAllEmployees,
  addNewEmployee,
  getAllEmpTime,
  EditEmployee,
  EditEmpTime,
};
