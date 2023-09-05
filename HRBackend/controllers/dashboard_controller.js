
const{GetEmployeeTotalCount,GetDepartmentTotalCount,GetJobsTotalCount,GetLast5JoinedEmployees}=require("../helpers/dashboard_helper")

const getDashboardData = async (req, res) => {
  try {
    const emp_count = await GetEmployeeTotalCount();
    const dept_count = await GetDepartmentTotalCount();
    const jobs_count = await GetJobsTotalCount();
    const get_last_Emps = await GetLast5JoinedEmployees();

    return res.send({
      state: "success",
      totalemp: emp_count,
      totaldept: dept_count,
      totaljob: jobs_count,
      latest_emps: get_last_Emps,
    });
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};

module.exports = getDashboardData;
