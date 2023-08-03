const mysql = require("mysql");
const xlsx = require("xlsx");
const fastcsv = require("fast-csv");
const fs = require("fs");
const moment = require("moment");
const { log } = require("console");
const { parse } = require("path");
const uploadSheetToDatabase = async (req, res) => {
    let connection;
    var files = req.files;

    try {

        if (files == undefined) {
            return res.send({ state: "error", message: "Please Add File" });
        }
        if (files.length != 3) {
            return res.send({ state: "error", message: "You Must upload only 3 files" });
        }

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







        connection = mysql.createConnection({
            user: "root",
            host: "localhost",
            password: "promech",
            database: "attend",
        });
        var workbook = xlsx.readFile("./sql/attend.xlsx");

        trunc_query = "truncate table at_emp_time";

        check_missing_employees_query = 'select distinct emp.emp_name from at_emp_time as emp where not  exists (select null from at_emps emp2 where emp2.card_id=emp.card_id  and emp2.company_name=emp.company_name)';

        insert_query = "insert into at_emp_time (card_id,emp_name,date,clock_in,clock_out,late,early,absent,remarks,trans,company_name) values ?";




        //create csv file from upload xlsx
        xlsx.writeFile(workbook, "./sql/attend.csv", { bookType: 'csv' });
        let stream = fs.createReadStream("./sql/attend.csv");

        let csvData = [];
        let csvStream = fastcsv.parse().on("data", function (data) {
            csvData.push(data);

        }).on("end", function () {
            csvData.shift();
            connection.query(trunc_query, function (err, result) {
                if (err) return res.send({ state: "error", message: err.message });
                connection.query(insert_query, [csvData], function (err, result1) {
                    if (err) return res.send({ state: "error", message: err.message });
                    connection.end();
                    submitDataToAtTransTable();
                    return res.send({ state: "success", message: "Successfully uploaded data" });


                })

            });


        });
        stream.pipe(csvStream);





    } catch (error) {
        console.log(error);
        return res.send({ state: "error", message: error.message });

    }
}

function manuplateDate(worksheet) {

    var excelData = xlsx.utils.sheet_to_json(worksheet);
    for (let i = 0; i < excelData.length; i++) {
        var obj = Object(excelData[i]);
        var full_date = new Date(obj["Date"]);

        obj["Date"] = `${full_date.getFullYear()}-${("0" + (full_date.getMonth() + 1)).slice(-2)}-${("0" + full_date.getDate()).slice(-2)}`;



    }
    return xlsx.utils.json_to_sheet(excelData);
}

function dateIsValid(date) {
    return !Number.isNaN(new Date(date).getTime());
}

async function submitDataToAtTransTable() {
    //we need for each employee to calculate all things and add new row in at_trans
    let connection;
    try {
        connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "promech",
            database: "attend",
        });
        var select_distinct_dates_query = 'select count( distinct date) as date_count from at_emp_time';
        var date_count = await new Promise((resolve, reject) => {
            connection.query(select_distinct_dates_query, (err, result) => {
                if (err) reject(err);

                resolve(result[0].date_count);



            })
        });

        var select_all_emp_time_query = 'SELECT emp_time.*,emp.rule_no FROM at_emp_time as emp_time left join at_emps emp on emp_time.card_id=emp.card_id and emp_time.company_name=emp.company_name';
        var emp_times = await new Promise((resolve, reject) => {
            connection.query(select_all_emp_time_query, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });

        });
        var insert_into_at_trans = 'insert into at_trans (card_id,emp_name,month,year,rule_no,company_name) values ?';



        for (let i = 0; i < emp_times.length; i += date_count) {
            var date = (emp_times[i].date).split('-');

            var values = [
                parseInt(emp_times[i].card_id),
                emp_times[i].emp_name,
                parseInt(date[1]),
                parseInt(date[0]),
                emp_times[i].rule_no,
                (emp_times[i].company_name).toString()
            ];

            connection.query(insert_into_at_trans, [[values]], (err, result) => {
            });
        }

        calculateEmpData(emp_times, date_count);

    } catch (error) {
        console.log(error);
    }
}
async function calculateEmpData(emp_times, date_count) {

    let connection = mysql.createConnection({
        host: "localhost",
        database: "attend",
        user: "root",
        password: "promech",
    });

    //update total late time in at_trans table for this user at this specific month,year
    var update_trans_late_query = 'update at_trans set t_late=? where card_id=?,month=?,year=?,company_name=?';
    var t_late_milliseconds = 0;

    var count = 0;
    for (let i = 0; i < emp_times.length; i++) {
        let clock_in = emp_times[i].clock_in.toString();
        var diff = 0;
        if (clock_in.length === 5) {
            var clock_slice = clock_in.split(":");
            var time1;
            var time2
            if (emp_times[i].rule_no === 1) {
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



        }
        count++;
        if (count === date_count) {
            //we neeed to update this row now 
            var msec = t_late_milliseconds;
            var hh = Math.floor(msec / 1000 / 60 / 60);
            msec -= hh * 1000 * 60 * 60;
            var mm = Math.floor(msec / 1000 / 60);
            count = 0;
            t_late_milliseconds = 0;
            value=[
                `${hh}:${mm}`,
                emp_times[i].card_id,
                parseInt(emp_times[i].month),
                parseInt(emp_times[i].year),
                emp_times[i].company_name.toString()
            ];
            connection.query(update_trans_late_query,[value], (err, res) => {
                if(err)console.log(err.sql);
            })
        }




    }


}

getMySqlConnection = () => {

}

module.exports = uploadSheetToDatabase;