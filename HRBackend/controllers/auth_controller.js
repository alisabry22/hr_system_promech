const {getnewToken} = require("../helpers/auth_helpers");
const oracleConnection = require("./oracle_connection");

const loginController=async(req,res)=>{
    const {username,password}=req.body;
    let connection;  
try {  

    if(!username||!password){
        return res.status(500).send({ state: "error", message:"username or password can't be empty"});

    }   else{
        connection=await oracleConnection();

        var check_query='select * from login where username=:1 and password=:2';
        const result=await connection.execute(check_query,[username,password],);
        console.log(result.rows.length);
        if(result.rows.length==0){
            return res.status(500).send({state:"error",message:"invalid username or password"});
        }else{
            const token=getnewToken(username);
            console.log(token);
            return   res.status(200).send({state:"success",username:username,password:password,token:token});

        }
    }  

} catch (error) {
      return res.status(500).send({ state: "error", message: error.message });
}   finally{
    if(connection){
        try {
                await connection.release();
        } catch (error) {
                return res.send({state:"error",message:error});
        }
    }
}
}

module.exports={loginController};