const mysql=require("mysql");

const LoadAllJobs=async(req,res)=>{
let connection;
try {
        connection=mysql.createConnection({
            host:'localhost',
            user:"root",
            password:"promech",
            database:"attend",
        });

    var get_all_jobs="select distinct j.job_code ,j.job_desc,count(e.emp_name) as total_emp from at_jobs j left join at_emps e on e.job_code=j.job_code group by  j.job_code ,j.job_desc order by j.job_code ASC";

    connection.query(get_all_jobs,function(err,result){
        if(err)return res.send({state:"error",message:err.toString()});
        return res.send({state:"success",alljobs:result});
    })
} catch (error) {
    return res.send({state:"error",message:error.message});
}

}

const AddNewJob=async(req,res)=>{
    let connection;
    let job_name=req.body.jobname;

    try {
            connection=mysql.createConnection({
                host:'localhost',
                user:"root",
                password:"promech",
                database:"attend",
            });
    
        var max_job_code="select ifnull(max(job_code),0) as maxcode from at_jobs";
                    
        var add_new_job_query="insert into at_jobs (job_code,job_desc) values (?,?)";

        connection.query(max_job_code,function(err,result){
            if(err)return res.send({state:"error",message:err.toString()});
             var maxcode=result[0].maxcode;
            connection.query(add_new_job_query,[maxcode+=1,job_name],function(err,result){
                if(err)return res.send({state:"error",message:err.toString()});
                return res.send({state:"success",message: "Succesfully Added New Job"});
            });
           
        })
    } catch (error) {
        return re.send({state:"error",message:error.toString()});
    }
    
}

module.exports={LoadAllJobs,AddNewJob};