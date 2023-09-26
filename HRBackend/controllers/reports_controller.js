

const { GetAllTimeReport } = require("../helpers/reports_helper");

GetAllTimeRepoData=async(req,res)=>{
  try {
    const result=await GetAllTimeReport();
    return res.send({state:"success",timerepo:result})
  } catch (error) {
        return res.send({state:"error",message:error});
  }
   
}



module.exports={GetAllTimeRepoData};