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
  UpdateEmployeeRuleAtTranss,
  getAllSections,
  getAllJobsInDb,
} = require("../helpers/employee_helper");
const oracleConnection = require("./oracle_connection");
const { node_transporter, SendEmailToEmployee } = require("../helpers/node_mailer");
const logger = require("../helpers/logger");
const ReadFileOfEmployee = require("../helpers/file_helper");

const getAllEmployees = async (req, res) => {
  try {
    var emps_result = await getAllEmployeesQuery();
    var depts_result = await GetAllDepartmentsQuery();
    var sect_resut=await getAllSections();
    var job_result=await getAllJobsInDb();
        //var section_result=await 

    res
      .status(200)
      .send({ state: "success", allemp: emps_result, alldept: depts_result,sect:sect_resut,job:job_result });
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

  const {
    card_id,
    company_name,
    empname,
    departmentName,
    role,
    status,
    email_address,
    manager_email_address,
    hiredate,
    casual_vacation,
    ordinary_vacation,
    job_code,
    sect_code,
    insurance_no
  } = req.body;
  try {
      
   
    connection = oracleConnection();
    let rolecode = role == "Manager" ? "1" : "2";

    const deptCode = await GetDepartmentCode(departmentName);
  
   

     
      
    const updateEmpResult = await UpdateEmployeeAtEmps(
      card_id,
      company_name,
      empname,
      deptCode,
      rolecode,
      status,
      email_address !="null" ? email_address : "",
      manager_email_address != "null" ? manager_email_address : "",
      hiredate,
      casual_vacation!="null"?casual_vacation:0,
      ordinary_vacation!="null"?ordinary_vacation:0,
      job_code,
      sect_code,
      insurance_no!="null"?insurance_no:0
    );
    if (updateEmpResult === 1) {
        //update at transs table emp row with new role
        await UpdateEmployeeRuleAtTranss(rolecode,card_id,company_name);
        
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
  var total_failed_emails=[];
  const { emps, form, cc } = req.body;

  try {
 
    if (emps.length != 0) {
      logger.info(`Current Date: ${new Date().toLocaleString()}`);
      logger.info(
        `Total number of employees to send emails:${emps.length}`
      );
      //loop on each employee to send mail for him
      for (let emp of emps) {
        console.log("emp is ",emp);
        let list_of_ccs =
          emp.manager_email_address != null &&
          emp.manager_email_address.length > 1
            ? `${emp.manager_email_address}`
            : "";

        for (var element of cc) {
          list_of_ccs += `,${element}`;
        }

        const file=await ReadFileOfEmployee(emp.card_id,emp.company_name);
        console.log(`file is for ${emp.email_address}` ,file);
        
        if(file!=false){
          //it means this function returns for me the excel sheet of employee so we can send him email
          const mail_options = {
            from: "hr.pro352@gmail.com",
            to: emp.email_address,
        
            cc: list_of_ccs,
            subject: form.title,
            text: form.body,
            attachments: [
              {
                filename: `${emp.employee_name}.xlsx`,
                path: `./emails/${file}`,
              },
            ],
          };
          const result= await SendEmailToEmployee(mail_options);
            //it means succes send email to this user
         if(result==true){
          logger.info(`Success sending email to: ${emp.email_address}`);

         }else{
          total_failed_emails.push(emp.email_address);
          logger.error(`Error sending file to : ${emp.email_address} , check his file at D:\\hr_system\\HRBackend\\emails`);

         }
        }
    
      }
    
            if(total_failed_emails.length!=0){
        //it means their are some failed emails send it back to frontend
        res.send({state:'error',message:`failed to send emails to ${total_failed_emails.length} employee(s)`});
      }else{
        res.send({state:'success',message:`successfully send emails to ${emps.length} employee(s)`});
      }
    }
  } catch (error) {
    console.log("sendEmailToEmployees ", error);
  }
};

const getAllEmailsFromDb = async (req, res) => {
  let connection;
  try {
    connection = await oracleConnection();
    const get_query =
      "select email_address from at_emps where email_address is not null";
    const result = await connection.execute(get_query);
    return res.send({ emails: result.rows });
  } catch (error) {
    return res.send({ state: "error", message: error.toString() });
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.log("getAllEmailsFromDb", error);
      }
    }
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
  getAllEmailsFromDb,
};
