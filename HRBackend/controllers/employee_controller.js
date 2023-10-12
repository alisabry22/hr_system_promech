const fs = require("fs");

const {
  UpdateTransAtTrans,
  GetSpecificEmployeeTimeFromAtEmpTime,
  UpdateRemarksAtTrans,
} = require("../helpers/common_helpers");
const {
  GetAllDepartmentsQuery,
  GetDepartmentCode,
} = require("../helpers/department_helper");
const {
  getAllEmployeesQuery,
  AddNewEmployeeHelper,
  GetAllEmpTime,
  UpdateEmployeeAtEmps,
  UpdateAtEmpTimeHelper,
  updatehistoryTableHelper,
} = require("../helpers/employee_helper");
const oracleConnection = require("./oracle_connection");
const { log, error } = require("console");
const { node_transporter } = require("../helpers/node_mailer");

const getAllEmployees = async (req, res) => {
  try {
    var emps_result = await getAllEmployeesQuery();
    var depts_result = await GetAllDepartmentsQuery();

    res
      .status(200)
      .send({ state: "success", allemp: emps_result, alldept: depts_result });
  } catch (error) {
    return res.status(500).send({ state: "error", message: error.message });
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
  const email_address = req.body.email_address;
  const manager_email_address = req.body.manager_email_address;

  try {
    await AddNewEmployeeHelper(
      cardId,
      empname,
      emptype,
      department,
      job,
      anual_vactation,
      casual_vacation,
      hiredate,
      company_name,
      sect_code,
      email_address,
      manager_email_address
    );

    return res.send({
      state: "success",
      message: "successfully added Employeee",
    });
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};
//get all employee time and return result back to front end
const getAllEmpTime = async (req, res) => {
  try {
    var result = await GetAllEmpTime();

    return res.send({ state: "success", emptime: result });
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};

const EditEmployee = async (req, res) => {
  console.log(req.body);
  const {
    empname,
    departmentName,
    role,
    status,
    email_address,
    manager_email_address,
  } = req.body;
  try {
    connection = oracleConnection();
    let rolecode = role == "Manager" ? "1" : "2";

    const deptCode = await GetDepartmentCode(departmentName);
    const updateEmpResult = await UpdateEmployeeAtEmps(
      empname,
      deptCode,
      rolecode,
      status,
      email_address != null ? email_address : "",
      manager_email_address != null ? manager_email_address : ""
    );
    if (updateEmpResult === 1) {
      res.send({ state: "success", message: "Successfully Updated Employee" });
    }
  } catch (error) {
    console.log(error);
    return res.send({ state: "error", message: error });
  }
};

const EditEmpTime = async (req, res) => {
  const { card_id, date, company_name, trans, remarks } = req.body;
  try {
    const result = await UpdateAtEmpTimeHelper(
      trans,
      remarks,
      card_id,
      company_name,
      date
    );

    if (result == 1) {
      //update at transs table

      await updateAtTransOnEachEdit(card_id, company_name);
      await updatehistoryTableOnEachEdit(
        date,
        card_id,
        company_name,
        trans,
        remarks
      );
      return res.send({
        state: "success",
        message: "Successfully Updated Employee Data",
      });
    }
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};
//update reports table
async function updateAtTransOnEachEdit(card_id, company_name) {
  try {
    const at_emp_time = await GetSpecificEmployeeTimeFromAtEmpTime(
      card_id,
      company_name
    );
    await UpdateTransAtTrans(at_emp_time, card_id, company_name);
    await UpdateRemarksAtTrans(at_emp_time, card_id, company_name);
  } catch (error) {
    return res.send({ state: "error", message: error });
  }
}

const getEmpsHistory = async (req, res) => {
  let connection;
  try {
    connection = await oracleConnection();
    var sql_query =
      "select * from at_trans order by card_id,company_name,date_day";
    const result = await connection.execute(sql_query);
    return res.status(200).send({ state: "success", history: result.rows });
  } catch (error) {
    return res
      .status(500)
      .send({ state: "error", message: "Failed to get data" });
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        return res
          .status(500)
          .send({ state: "error", message: error.toString() });
      }
    }
  }
};
//updating history table on each edit from at_emp_time
async function updatehistoryTableOnEachEdit(
  date_day,
  card_id,
  company_name,
  trans_amt,
  remarks
) {
  try {
    const result = await updatehistoryTableHelper(
      date_day,
      card_id,
      company_name,
      trans_amt,
      remarks
    );
    return result;
  } catch (error) {
    console.log("updatehistoryTableOnEachEdit ", error);
  }
}

const sendEmailToEmployees = async (req, res) => {
  try {
    const {
      card_id,
      emp_name,
      email_address,
      manager_email_address,
      company_name,
    } = req.body;
    if (card_id && company_name) {
      fs.readdir("./emails", (err, files) => {
        if (err) {
          console.log("error", err);
        }
        var empfilename = company_name + "_" + card_id;
        var empfiles = files.filter((filename) =>
          filename.includes(empfilename)
        );
        const mail_options = {
          from: "smoothbaron@gmail.com",
          to: email_address,
          subject: "Attendance Sheet",
          text: "This is Your attendance",
          attachments: [
            {
              filename: `${emp_name}.xlsx`,
              path: `./emails/${empfiles[0]}`,
            },
          ],
        };
        node_transporter.sendMail(mail_options, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            log("info", info);
          }
        });
      });
    }
  } catch (error) {
    console.log("sendEmailToEmployees ", error);
  }
};
module.exports = {
  getAllEmployees,
  addNewEmployee,
  getAllEmpTime,
  EditEmployee,
  EditEmpTime,
  getEmpsHistory,
  updatehistoryTableOnEachEdit,
  sendEmailToEmployees,
};
