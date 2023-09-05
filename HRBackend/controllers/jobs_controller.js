
const { GetAllJobsQuery, AddNewJobToDb } = require("../helpers/jobs_helper");


const LoadAllJobs=async(req,res)=>{

try {
     
    const result=await GetAllJobsQuery();

 
        return res.send({state:"success",alljobs:result});

} catch (error) {
    return res.send({state:"error",message:error.message});
}

}

const AddNewJob=async(req,res)=>{
   
    let job_name=req.body.jobname;

    try {
        await AddNewJobToDb(job_name);
 return res.send({state:"success",message: "Succesfully Added New Job"});
        
    } catch (error) {
        return re.send({state:"error",message:error.toString()});
    }
    
}

module.exports={LoadAllJobs,AddNewJob};