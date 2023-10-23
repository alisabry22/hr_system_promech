const {
  GetAllDepartmentsQuery,
  GetManagersEmails,
} = require("../helpers/department_helper");
const { GetAllJobsQuery } = require("../helpers/jobs_helper");
const { GetAllSectionsQuery } = require("../helpers/sections_helper");

const getAllDepartments = async (req, res) => {
  try {
    var depts_query = await GetAllDepartmentsQuery();
    var jobs_query = await GetAllJobsQuery();
    var sections_query = await GetAllSectionsQuery();
    var manager_emails = await GetManagersEmails();

    return res.send({
      state: "success",
      departments: depts_query,
      jobs: jobs_query,
      sects: sections_query,
      manager_emails: manager_emails,
    });
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};

const AddNewDepartment = async (req, res) => {
  let connection;
  var dept_name = req.body.deptname;
  try {
    connection = oracleConnection();

    var select_max_dept_code_query =
      "select ifnull( max(DEPT_CODE),0) as deptcode from at_dept";
    var addDept = "insert into at_dept (dept_code,dept_desc) values (?,?)";

    connection.execute(select_max_dept_code_query, function (err, result) {
      if (err) throw err;
      connection.execute(
        addDept,
        [result[0].deptcode++, dept_name],
        function (err, result1) {
          if (err) throw err;
          connection.end();
          return res.send({
            state: "success",
            message: "Successfully added new Department",
          });
        }
      );
    });

    //             var binding=[
    //                 latest_dept_code,
    //                 dept_name,

    //             ];
    //   var result=  await connection.execute(addDept,binding);
    //   console.log(result);
    //     connection.commit();
    //     connection.close();
  } catch (error) {
    console.log(error);
    return res.send({ state: "error", message: error.message });
  }
};

const DeleteDepartments = async (req, res) => {
  let connection;
  var dept_codes = [];
  dept_codes.push(req.body.dept_codes);

  try {
    connection = oracleConnection();

    var delete_query = `delete from at_dept where dept_code in (`;
    for (i = 0; i < dept_codes.length; i++) {
      delete_query += i > 0 ? ", :" + i : ":" + i;
    }
    delete_query += ")";

    result = await connection.execute(delete_query, dept_codes);

    connection.commit();
    connection.close();
    return res.send({
      state: "success",
      message: "Successfully Deleted Departments",
    });
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};
module.exports = { getAllDepartments, AddNewDepartment, DeleteDepartments };
