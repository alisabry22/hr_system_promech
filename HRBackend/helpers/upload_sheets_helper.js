const childprocess = require("child_process");
const xlsx = require("xlsx");
const oracleConnection = require("../controllers/oracle_connection");
const {GetDistinctDaysAtEmpTime,GetAllEmpTimeWithHisRule,} = require("./common_helpers");
const moment=require("moment");
const { parse } = require("querystring");

function UploadSheetsToDatabaseHelper() {
  return new Promise(async function (resolve, reject) {
    try {
      var promech = xlsx.readFile("./sql/promech.xlsx");
      var penta3d = xlsx.readFile("./sql/penta3d.xlsx");
      var promech12 = xlsx.readFile("./sql/promech12.xlsx");
      //get sheets of promech and  promech12 and penta3d
      var promechsheet = promech.Sheets[promech.SheetNames[0]];

      var penta3dsheet = penta3d.Sheets[penta3d.SheetNames[0]];
      var promech12sheet = promech12.Sheets[promech12.SheetNames[0]];

      var newbook = xlsx.utils.book_new();

      //get last card id of promech data employees

      var penta3dData = xlsx.utils.sheet_to_json(penta3dsheet);
      var promech12Data = xlsx.utils.sheet_to_json(promech12sheet);

      let penta3daoe = [];
      let promech12aoe = [];
      for (let key of penta3dData) {
        penta3daoe.push(Object.values(key));
      }
      for (let key of promech12Data) {
        promech12aoe.push(Object.values(key));
      }

      //add data of penta3d and promech12 to promech
      xlsx.utils.sheet_add_aoa(promechsheet, penta3daoe, { origin: -1 });
      xlsx.utils.sheet_add_aoa(promechsheet, promech12aoe, { origin: -1 });

      xlsx.utils.book_append_sheet(newbook, promechsheet, "promech");

      //manuplate date as date
      var sheet = manuplateDate(newbook.Sheets[newbook.SheetNames[0]]);
      var latest_book = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(latest_book, sheet, "promech");

      xlsx.writeFileXLSX(latest_book, "./sql/attend.xlsx");

      var workbook = xlsx.readFile("./sql/attend.xlsx");

      connection = await oracleConnection();
      var workbook = xlsx.readFile("./sql/attend.xlsx");

      var trunc_query = "truncate table at_emp_time";


      //create csv file from upload xlsx
      xlsx.writeFile(workbook, "./sql/attend.csv", { bookType: "csv" });
      await connection.execute(trunc_query);
      sql_loader ="sqlldr userid=attend/attend control=D:\\hr_system\\HRBackend\\sql\\at_emp_time.ctl log=D:\\hr_system\\HRBackend\\sql\\at_emp_time.log skip=1";
      
      childprocess.execSync(sql_loader);
      resolve(true);
     

      
    } catch (error) {
      console.log("Upload Sheets Helper Database", error);
      reject(error);
    }
  });
}

function manuplateDate(worksheet) {
  var excelData = xlsx.utils.sheet_to_json(worksheet);
  for (let i = 0; i < excelData.length; i++) {
    var obj = Object(excelData[i]);
    var full_date = new Date(obj["Date"]);

    obj["Date"] = `${full_date.getFullYear()}-${(
      "0" +
      (full_date.getMonth() + 1)
    ).slice(-2)}-${("0" + full_date.getDate()).slice(-2)}`;
  }
  return xlsx.utils.json_to_sheet(excelData);
}

// function dateIsValid(date) {
//   return !Number.isNaN(new Date(date).getTime());
// }

async function SubmitDataToAtTransTable() {
    //we need for each employee to calculate all things and add new row in at_trans
  
    let connection;
    try {
             connection=await oracleConnection();
           
        const date_count = await GetDistinctDaysAtEmpTime();

        var emp_times = await GetAllEmpTimeWithHisRule();
       
    
        var insert_into_at_trans =`insert into at_transs (card_id,emp_name,month,year,rule_no,company_name) values (:1,:2,:3,:4,:5,:6)`;
      
        for (let i = 0; i < emp_times.length; i += date_count) {
            let date =   moment.utc(emp_times[date_count - 1][2]).format("DD/MM/YYYY");
            date=date.toString().split("/");
        
        
           
          
          var values = [
            parseInt(emp_times[i][0]),
            (emp_times[i][1]).toString(),
            parseInt(date[1]),
            parseInt(date[2]),
            emp_times[i][12],
            (emp_times[i][10]).toString(),
          ];
          
          console.log("values are ",values);
    
         await connection.execute(insert_into_at_trans, values);
    
        }
        await connection.commit();
              //calculating total late for each emp
               calculateTotalLateData(emp_times, date_count);
              //calculating total absent for each emp
        
               CalculateTotalAbsent(emp_times, date_count);
            //   //calculating total attendance
              CalculateTotalAttendHours(emp_times, date_count);
   
    } catch (error) {
        console.log("error",error);
     
    }

}

async function calculateTotalLateData(emp_times, date_count) {
    try {
    
    let connection = await oracleConnection();
  
    //update total late time in at_trans table for this user at this specific month,year
    var update_trans_late_query ="update at_transs set t_late=? where card_id=? and month=? and year=? and company_name=?";
    var t_late_milliseconds = 0;
  
    var count = 0;
    for (let i = 0; i < emp_times.length; i++) {
      let clock_in="" ;
      if(emp_times[i][3]!=null){
          clock_in=(emp_times[i][3]).toString();
      }
      var diff = 0;
      if (clock_in.length === 5) {
        var clock_slice = clock_in.split(":");
        var time1;
        var time2;
        if (emp_times[i][12] === 1) {
          //it means he is manager
          time1 = new Date(2000, 0, 1, clock_slice[0], clock_slice[1]);
          time2 = new Date(2000, 0, 1, 10, 30);
        } else {
          // it means he is employee
          time1 = new Date(2000, 0, 1, clock_slice[0], clock_slice[1]);
          time2 = new Date(2000, 0, 1, 9, 10);
        }
  
        diff = time1 - time2;
  
        if (Math.sign(diff) == 1) {
          t_late_milliseconds += diff;
        }
      } else {
        //معناها هنا انه مبصمش علي البصمه هشوف بقي لو مبصمش وكمان مش غايب عشان احسب عليه ساعه تأخير
  
        if (emp_times[i][7]!= "True") {
          t_late_milliseconds += 3600000;
        }
      }
      count++;
      if (count === date_count) {
        //we neeed to update this row now
  
        let date =   moment.utc(emp_times[i][2]).format("DD/MM/YYYY");
        date=date.toString().split("/");
        var msec = t_late_milliseconds;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        count = 0;
        t_late_milliseconds = 0;
        value = [
          `${hh}:${mm}`.toString(),
          parseInt(emp_times[i][0]),
          parseInt(date[1]),
          parseInt(date[2]),
          emp_times[i][10].toString(),
        ];
        connection.execute(update_trans_late_query, value, { autoCommit: true });
      }
    }
    } catch (error) {
            console.log("Calculate total late",error);
  
}
}

async function CalculateTotalAbsent(emp_times, date_count) {
    try {
            
  let connection = await oracleConnection();

  //update total late time in at_trans table for this user at this specific month,year
  var update_trans_late_query =
    "update at_transs set t_absent=? where card_id=? and month=? and year=? and company_name=?";
  var t_absent_count = 0;

  var count = 0;
  for (let i = 0; i < emp_times.length; i++) {
    if (emp_times[i][7] === "True") {
      t_absent_count += 1;
    }
    count++;
    if (count === date_count) {
        let date =   moment.utc(emp_times[i][2]).format("DD/MM/YYYY");
        date=date.toString().split("/");
      //we neeed to update this row now
      value = [
        t_absent_count,
        parseInt(emp_times[i][0]),
        parseInt(date[1]),
        parseInt(date[2]),
        emp_times[i][10],
      ];

      count = 0;
      t_absent_count = 0;

     await connection.execute(update_trans_late_query, value, { autoCommit: true });
    }
  }
    } catch (error) {
        console.log("Calculate Total Absent",error);
    }

}

async function CalculateTotalAttendHours(emp_times, date_count) {

        try {
            let connection = await oracleConnection();

            //update total late time in at_trans table for this user at this specific month,year
            var update_trans_late_query =
              "update at_transs set t_attend=? where card_id=? and month=? and year=? and company_name=?";
            var t_attend_hours = 0;
          
            var count = 0;
            for (let i = 0; i < emp_times.length; i++) {
              if (emp_times[i][3]!=null &&emp_times[i][4]!=null) {
                clock_in_slice = emp_times[i][3].toString().split(":");
                clock_out_slice = emp_times[i][4].toString().split(":");
                time1 = new Date(2000, 0, 1, clock_in_slice[0], clock_in_slice[1]);
                time2 = new Date(2000, 0, 1, clock_out_slice[0], clock_out_slice[1]);
                diff = time2 - time1;
          
                t_attend_hours += diff;
              }
              count++;
              if (count === date_count) {
                var msec = t_attend_hours;
                var hh = Math.floor(msec / 1000 / 60 / 60);
                msec -= hh * 1000 * 60 * 60;
                var mm = Math.floor(msec / 1000 / 60);
                let date =   moment.utc(emp_times[i][2]).format("DD/MM/YYYY");
                date=date.toString().split("/");
                //we neeed to update this row now
                value = [
                  `${hh}:${mm}`.toString(),
                  emp_times[i][0],
                  parseInt(date[1]),
                  parseInt(date[2]),
                  emp_times[i][10],
                ];
          
                count = 0;
                t_attend_hours = 0;
          
             await   connection.execute(update_trans_late_query, value, { autoCommit: true });
              }
            }
        } catch (error) {
                console.log("Calcualte Total Attend",error);
        }
  
}

module.exports = { UploadSheetsToDatabaseHelper, SubmitDataToAtTransTable };
