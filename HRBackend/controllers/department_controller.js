const mysql=require("mysql");


const getAllDepartments=async(req,res)=>{
    let connection;
    try {
        connection = mysql.createConnection({
            host: "localhost",
            password: "promech",
            database: "attend",
            user: "root",
            multipleStatements: true,
          });
          connection.connect(); 
       
          var get_dept_query="select distinct d.dept_code ,d.dept_desc,count(e.emp_name) as emp_count from at_dept d left join at_emps e on e.dept_code=d.dept_code group by  d.dept_desc ,d.dept_code order by d.dept_code ASC";
          var get_jops_query="select job_desc,job_code from at_jobs ORDER BY job_code ASC";
         connection.query(get_dept_query,function(err,result){
            if(err)return res.send({status:"error",message:err})
            connection.query(get_jops_query,function(err,result1){
              if(err)return res.send({status:"error",message:err})
              console.log(result,result1);
              return res.send({state:"success",departments:result,jobs:result1});
            })
         } );

    
  } catch (error) {
        return res.send({state:"error", message:error.message});
  }
  }

const AddNewDepartment=async(req,res)=>{
    let connection;
    var dept_name=req.body.deptname;
    try {

        connection = mysql.createConnection({
            host: "localhost",
            password: "promech",
            database: "attend",
            user: "root",
            multipleStatements: true,
          });
          connection.connect(); 

          var select_max_dept_code_query="select ifnull( max(DEPT_CODE),0) as deptcode from at_dept";
            var addDept="insert into at_dept (dept_code,dept_desc) values (?,?)";
                    
                 connection.query(select_max_dept_code_query,function(err,result){
                   if(err)throw err;  
                   console.log(result[0].deptcode++,dept_name);  
                   connection.query(addDept,[result[0].deptcode++,dept_name],function(err,result1){
                    if(err)throw err;
                    connection.end();
                    return res.send({state:"success",message:"Successfully added new Department"});
                   })
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
        return res.send({state:"error",message:error.message});
    }
}

const DeleteDepartments=async(req,res)=>{
    let connection;
    var dept_codes=[];
     dept_codes.push(req.body.dept_codes);

   try {
     connection=await oracledb.getConnection({
         user:"ATTEND",
         password:"attend",
         connectString:"192.168.0.69:1521/xe",
             });

        var delete_query=`delete from at_dept where dept_code in (`;
        for( i=0 ; i<dept_codes.length; i++){
            delete_query+=(i>0)?", :"+i :":"+i;
            
        };
        delete_query+=")";
      
         result=await  connection.execute(delete_query,dept_codes);

         
          connection.commit();
        connection.close();
        return res.send({state:"success",message:"Successfully Deleted Departments"});


   } catch (error) {
    return res.send({state:"error",message:error.message});
   }

}
module.exports={getAllDepartments,AddNewDepartment,DeleteDepartments};