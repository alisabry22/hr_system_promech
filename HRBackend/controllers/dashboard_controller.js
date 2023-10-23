
const{GetEmployeeTotalCount,GetDepartmentTotalCount,GetJobsTotalCount,GetLast5JoinedEmployees, getTotalSections, getTop5Attendance}=require("../helpers/dashboard_helper")

const getDashboardData = async (req, res) => {
  try {
    const emp_count = await GetEmployeeTotalCount();
    const dept_count = await GetDepartmentTotalCount();
    const jobs_count = await GetJobsTotalCount();
    const get_last_Emps = await GetLast5JoinedEmployees();
    const total_Sects=await getTotalSections();
   var topFiveEmps= await getTop5Attendance();
  

    return res.send({
      state: "success",
      totalemp: emp_count,
      totaldept: dept_count,
      totaljob: jobs_count,
      latest_emps: get_last_Emps,
      totalsect:total_Sects,
      topfive:topFiveEmps,
    });
  } catch (error) {
    return res.send({ state: "error", message: error.message });
  }
};

module.exports = getDashboardData;
