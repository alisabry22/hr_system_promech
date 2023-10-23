const fs=require("fs");
//get excel sheet of each employee based on his card_id and company_name which they are primary keys in our database
function ReadFileOfEmployee(card_id,company_name){
    return new Promise(async function(resolve,reject){
        fs.readdir("./emails", async (err, files) => {
            if (err) {
              console.log(err);
              reject(false);
            }else{
                var empfilename = company_name + "_" + card_id;
                var empfiles = files.filter((filename) =>
                  filename.includes(empfilename)
                );
                //return first file found for employee.
                resolve(empfiles[0]);
            }
       
        
  
    })
})
}
module.exports=ReadFileOfEmployee;