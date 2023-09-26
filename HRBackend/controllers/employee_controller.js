const { UpdateTransAtTrans, GetSpecificEmployeeTimeFromAtEmpTime, UpdateRemarksAtTrans } = require("../helpers/common_helpers");
const { GetAllDepartmentsQuery, GetDepartmentCode } = require("../helpers/department_helper");
const {
  getAllEmployeesQuery,
  AddNewEmployeeHelper,
  GetAllEmpTime,
  UpdateEmployeeAtEmps,
  UpdateAtEmpTimeHelper,
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
  const {empname,departmentName,role,status}=req.body;
  try {
    connection = oracleConnection();
    let rolecode = role == "Manager" ? "1" : "2";
   
    const deptCode=await GetDepartmentCode(departmentName);
    const updateEmpResult=await UpdateEmployeeAtEmps(empname,deptCode,rolecode,status);  
    if(updateEmpResult===1){
      res.send({state:"success",message:"Successfully Updated Employee"});
    }
   
  } catch (error) {
    console.log(error);
    return res.send({ state: "error", message: error });
  }
};

const EditEmpTime = async (req, res) => {

  const { card_id, date, company_name, trans, remarks } = req.body;
  try {
    
    const result=  await UpdateAtEmpTimeHelper(trans,remarks,card_id,company_name,date);
    
      if(result==1){
        //update at transs table
        
       await updateAtTransOnEachEdit(card_id, company_name);
       return res.send({state:"success",message:"Successfully Updated Employee Data"});

      }

  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};

async function updateAtTransOnEachEdit(card_id, company_name) {

  try {
    
    const at_emp_time=await GetSpecificEmployeeTimeFromAtEmpTime(card_id,company_name);
    await UpdateTransAtTrans(at_emp_time,card_id,company_name);
  await UpdateRemarksAtTrans(at_emp_time,card_id,company_name);
    
  } catch (error) {
    return res.send({state:"error",message:error});
  }
}



module.exports = {
  getAllEmployees,
  addNewEmployee,
  getAllEmpTime,
  EditEmployee,
  EditEmpTime,
};
