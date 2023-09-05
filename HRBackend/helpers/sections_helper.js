const oracleConnection = require("../controllers/oracle_connection");


function GetAllSectionsQuery(){
    return new Promise(async function(resolve,reject){

        let connection;
  
        try {
            var get_sects_query="select sect_code,sect_desc from at_sect ORDER BY sect_code ASC";
                connection=await oracleConnection();

                const result=await  connection.execute(get_sects_query);
       
              resolve(result.rows);
             
        } catch (error) {
            console.log("error",error);
                reject(error);
        }finally{
            if(connection){
                try {
                    await connection.release();
                } catch (error) {
                        console.error(error);
                }
            }
        }
    })
}

module.exports={GetAllSectionsQuery};