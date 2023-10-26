const oracleConnection = require("../controllers/oracle_connection");

function getAllEmployeesQuery() {
  return new Promise(async function (resolve, reject) {
    let connection;
    try {
      connection = await oracleConnection();
      var sql_select_emp =
        "select e.card_id,e.emp_name, j.job_desc, e.hire_date,e.dept_code,e.status,e.sect_code,s.sect_desc,d.dept_desc ,r.rule_desc,e.email_address,e.manager_email_address,e.company_name,e.casual_days,e.ordinary_days,e.insurance_no from at_emps  e  left join at_dept d  on e.dept_code=d.dept_code left join at_rules r  on e.rule_no = r.rule_no left join at_jobs j on e.job_code=j.job_code left join at_sect s on e.sect_code=s.sect_code where 1=1 ORDER BY card_id ASC";
      const result = await connection.execute(sql_select_emp);

      resolve(result.rows);
    } catch (error) {
      reject(error);
      console.log(error);
    } finally {
      if (connection) {
        try {
          await connection.release();
        } catch (error) {
          console.error(e);
        }
      }
    }
  });
}

function AddNewEmployeeHelper(
  card_id,
  empname,
  emptype,
  department,
  job,
  ordinary_vacation,
  casual_vacation,
  hire_date,
  company_name,
  sect_code,
  email_address,
  manager_email_address
) {
  return new Promise(async function (resolve, reject) {
    var max_emp_no = await GetMaxEmpNo();

    const insert_emp_query = `INSERT INTO at_emps  (card_id,emp_no,emp_name,hire_date,dept_code,job_code,rule_no,ordinary_days,casual_days,company_name,sect_code,status,email_address,manager_email_address) values(:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11,:12,:13,:14)`;
    var binds = [
      card_id,
      (max_emp_no += 1),
      empname,
      hire_date,
      department,
      job,
      emptype == "Manager" ? 1 : 2,
      ordinary_vacation,
      casual_vacation,
      company_name,
      sect_code == "Product Development"
        ? 1
        : "Manufacturing Solutions"
        ? 2
        : 3,
      1,
      email_address,
      manager_email_address,
    ];
    let connection;
    try {
      connection = await oracleConnection();
      const addEmpResult = await connection.execute(insert_emp_query, binds, {
        autoCommit: true,
      });

      resolve(addEmpResult.rowsAffected);
    } catch (error) {
      console.log(error);
      reject(error);
    } finally {
      if (connection) {
        try {
          await connection.release();
        } catch (error) {
          console.error(error);
        }
      }
    }
  });
}

function GetMaxEmpNo() {
  return new Promise(async function (resolve, reject) {
    let connection;
    const get_max_empNo = "select nvl(max(emp_no),0) as emp_no from at_emps";
    try {
      connection = await oracleConnection();
      const result = await connection.execute(get_max_empNo);

      resolve(result.rows[0][0]);
    } catch (error) {
      reject(error);
      console.log(error);
    } finally {
      if (connection) {
        try {
          await connection.release();
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
}

function GetAllEmpTime() {
  return new Promise(async function (resolve, reject) {
    let connection;
    var get_emp_time_query = "select * from at_emp_time order by card_id , company_name,emp_name,date_day";
    try {
      connection = await oracleConnection();
      const result = await connection.execute(get_emp_time_query);

      resolve(result.rows);
    } catch (error) {
      reject(error);
      console.log(error);
    } finally {
      if (connection) {
        try {
          await connection.release();
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
}

function UpdateEmployeeAtEmps(
  card_id,
  company_name,
  empname,
  deptcode,
  ruleno,
  empstatus,
  email_address,
  manager_email_address,
  hiredate,
  casual_days,
  ordinary_days,
  job_code,
  sect_code,
  insurance_no
) {
  
  return new Promise(async function (resolve, reject) {
    
    let connection;
    var updateQuery =
      "update at_emps set emp_name=:1 , dept_code=:2 ,rule_no=:3,status=:4,email_address=:5,manager_email_address=:6 , hire_date=:7,casual_days=:8,ordinary_days=:9,job_code=:10,sect_code=:11,insurance_no=:12 where card_id=:13 and company_name=:14";
  
    try {
      connection = await oracleConnection();
      const result = await connection.execute(
        updateQuery,
        [
          empname,
          deptcode,
          ruleno,
          parseInt(empstatus),
          email_address != null ? email_address : "",
          manager_email_address != null ? manager_email_address : "",
          hiredate.length!=0?new Date(hiredate):null,
          casual_days!=null?parseInt(casual_days):null,
         ordinary_days!=null? parseInt(ordinary_days):null,
          parseInt(job_code),
          parseInt(sect_code),
         insurance_no!=null? parseInt(insurance_no):null,
          parseInt(card_id),
          company_name,
        ],
        { autoCommit: true }
      );

      resolve(result.rowsAffected);
    } catch (error) {
      reject(error);
    } finally {
      if (connection) {
        try {
          await connection.release();
        } catch (error) {
          console.error(error);
        }
      }
    }
  });
}

function UpdateEmployeeRuleAtTranss(rule,card_id, company_name) {
  return new Promise(async function (resolve, reject) {
    let connection;
    var updateQuery =
      "update at_transs set rule_no=:1  where card_id=:2 and company_name=:3";

    try {
      connection = await oracleConnection();
      const result = await connection.execute(
        updateQuery,
        [parseInt(rule), parseInt(card_id), company_name],
        { autoCommit: true }
      );

      resolve(result.rowsAffected);
    } catch (error) {
      reject(error);
    } finally {
      if (connection) {
        try {
          await connection.release();
        } catch (error) {
          console.error(error);
        }
      }
    }
  });
}

function UpdateAtEmpTimeHelper(trans, remarks, card_id, company_name, date) {
  return new Promise(async function (resolve, reject) {
    let connection;
    try {
      const update_emp_query =
        "update at_emp_time set  trans_amt=:1 , remarks=:2 where card_id=:3 and company_name=:4 and date_day=:5";
      var binds = [
        parseInt(trans),
        remarks,
        parseInt(card_id),
        company_name,
        new Date(date),
      ];

      connection = await oracleConnection();
      const result = await connection.execute(update_emp_query, binds, {
        autoCommit: true,
      });
      resolve(result.rowsAffected);
    } catch (error) {
      console.log(error);
      reject(error);
    } finally {
      if (connection) {
        await connection.release();
      } else {
        console.error(error);
      }
    }
  });
}

function updatehistoryTableHelper(
  date_day,
  card_id,
  company_name,
  trans_amt,
  remarks
) {
  return new Promise(async function (resolve, reject) {
    let connection;
    try {
      connection = await oracleConnection();
      const update_query =
        "update at_trans set trans_amt=:1,remarks=:2 where date_day=:3 and card_id=:4 and company_name=:5";
      var binds = [
        parseInt(trans_amt),
        remarks,
        new Date(date_day),
        parseInt(card_id),
        company_name,
      ];

      const result = await connection.execute(update_query, binds, {
        autoCommit: true,
      });

      resolve(result.rowsAffected);
    } catch (error) {
      reject(error);
    } finally {
      if (connection) {
        try {
          await connection.release();
        } catch (error) {
          console.log("updatehistoryTableHelper ", error);
        }
      }
    }
  });
}

function getAllSections(){
  return new Promise(async function (resolve, reject) {
    let connection;
    var get_section_query = "select sect_code , sect_desc from at_sect";
    try {
      connection = await oracleConnection();
      const result = await connection.execute(get_section_query);

      resolve(result.rows);
    } catch (error) {
      reject(error);
      console.log(error);
    } finally {
      if (connection) {
        try {
          await connection.release();
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
}

function getAllJobsInDb(){
  return new Promise(async function (resolve, reject) {
    let connection;
    var get_section_query = "select job_code,job_desc from at_jobs";
    try {
      connection = await oracleConnection();
      const result = await connection.execute(get_section_query);

      resolve(result.rows);
    } catch (error) {
      reject(error);
      console.log(error);
    } finally {
      if (connection) {
        try {
          await connection.release();
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
}

module.exports = {
  getAllEmployeesQuery,
  AddNewEmployeeHelper,
  GetAllEmpTime,
  UpdateEmployeeAtEmps,
  UpdateAtEmpTimeHelper,
  updatehistoryTableHelper,
  UpdateEmployeeRuleAtTranss,
  getAllSections,
  getAllJobsInDb
};
