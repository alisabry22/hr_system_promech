var xlsx = require("xlsx");
const read_From_excel = require("read-excel-file");
const moment = require("moment");
//handle Promech Excel
const Promech = async (req, res) => {
  var fileType = req.body.fileType;
  var file = req.file;
  if (!fileType || !file) {
    return res.send({
      state: "error",
      message: "Some Values are not Specified",
    });
  }
  if (file.originalname != "promech.xlsx") {
    return res.send({ state: "error", message: "Wrong File Type for Promech" });
  }
  try {
    //manuplate time first
    manuplateTime(file);
    //get days count

    var count_days = getTotalDiffDays(file);

    //get names of employees
    var names = getDiffNames(file);

    createExcel(names, file, count_days);
    return res.send({
      state: "success",
      message: " Successfully uploaded file",
    });
  } catch (error) {
    console.log(error);
    return res.send({ state: "error", message: error });
  }
};

//handle Penta Excel

const penta3d = async (req, res) => {
  fileType = req.body.fileType;
  file = req.file;
  try {
    if (!fileType || !file) {
      return res.send({
        state: "error",
        message: "Some Values are not Specified",
      });
    }
    if (file.originalname != "penta3d.xlsx") {
      return res.send({
        state: "error",
        message: "Wrong File Type for Penta3d",
      });
    }
    //for editing penta3d and promech12 sheets to be as promech sheet
    manipulateSheet(file, "penta3d");
    var count_days = getTotalDiffDays(file);

    //get names of employees
    var names = getDiffNames(file);

    createExcel(names, file, count_days);
    return res.send({
      state: "success",
      message: " Successfully uploaded file",
    });
  } catch (error) {
    return res.send({ state: "error", message: error });
  }
};

//handle promech 12 excel file
const promech12 = async (req, res) => {
  fileType = req.body.fileType;

  file = req.file;
  try {
    if (!fileType || !file) {
      return res.send({
        state: "error",
        message: "Some Values are not Specified",
      });
    }
    if (file.originalname != "promech12.xlsx") {
      return res.send({
        state: "error",
        message: "Wrong File Type for Promech12",
      });
    }

    manipulateSheet(file, "promech12");
    var count_days = getTotalDiffDays(file);

    //get names of employees
    var names = getDiffNames(file);

    createExcel(names, file, count_days);
    return res.send({
      state: "success",
      message: " Successfully uploaded file",
    });
  } catch (error) {
    return res.send({ state: "error", message: error });
  }
};

//manipulate time
function manuplateTime(file) {
  //get sheet from workbook
  try {
    var workbook = xlsx.readFile(`./uploads/${file.filename}`);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    var jsonExcel = xlsx.utils.sheet_to_json(worksheet);

    //update late , early time

    for (let i = 0; i < jsonExcel.length; i++) {
      //manuplate late
      if (jsonExcel[i]["Clock In"]) {
        let parseClockIn = String(jsonExcel[i]["Clock In"]);
        const attendtime = "08:40";
        start = attendtime.split(":");
        end = parseClockIn.split(":");
        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = endDate.getTime() - startDate.getTime();

        if (diff > 0) {
          let hours = String(Math.floor(diff / 1000 / 60 / 60));
          diff -= hours * 1000 * 60 * 60;
          var minutes = String(Math.floor(diff / 1000 / 60));
          if (minutes.length == 1) {
            jsonExcel[i]["Late"] = `0${hours}:0${minutes}`;
          } else {
            jsonExcel[i]["Late"] = `0${hours}:${minutes}`;
          }
        } else {
          jsonExcel[i]["Late"] = "";
        }
      }
      jsonExcel[i]["Mission"] = "";
      jsonExcel[i]["Trans"] = "";
      jsonExcel[i]["CompanyName"] = "promech";
    }

    var newworkbook = xlsx.utils.book_new();
    var newsheet = xlsx.utils.json_to_sheet(jsonExcel);
    xlsx.utils.book_append_sheet(newworkbook, newsheet, `${file.filename}`);
    xlsx.writeFile(newworkbook, `./output/${file.filename}`);
  } catch (error) {
    console.log(error);
  }
}
//this function gets the total diff numbers for every employee
function getTotalDiffDays(file) {
  try {
    var workbook = xlsx.readFile(`./output/${file.filename}`);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    var jsonExcel = xlsx.utils.sheet_to_json(worksheet);
    let count = [];
    let obj = {};

    jsonExcel.forEach((val) => {
      obj[val["Name"]] = (obj[val["Name"]] || 0) + 1;
    });
    count = Object.entries(obj);
    return count[0][1];
  } catch (error) {
    console.log(error);
  }
}

function getDiffNames(file) {
  try {
    var workbook = xlsx.readFile(`./output/${file.filename}`);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    var jsonExcel = xlsx.utils.sheet_to_json(worksheet);
    let Names = [];
    jsonExcel.forEach((val) => {
      Names.push(val["Name"]);
    });
    return new Set(Names);
  } catch (error) {
    console.log(error);
  }
}

function createExcel(nameslist, file, count_days) {
  try {
    //get names of employees
    Names = Array.from(nameslist);
    //create new workbook

    var workbook = xlsx.readFile(`./output/${file.filename}`);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    var jsonExcel = xlsx.utils.sheet_to_json(worksheet);

    //get every n rows of each employee
    var empdata = [];
    for (let i = 0; i < jsonExcel.length; i += count_days) {
      empdata.push(jsonExcel.slice(i, i + count_days));
    }

    //create seperate workbook for each employee
    let i = 0;
    empdata.forEach((val) => {
      var workbook = xlsx.utils.book_new();
      var newsheet = xlsx.utils.json_to_sheet(val);

      xlsx.utils.book_append_sheet(workbook, newsheet, Names[i]);

      xlsx.writeFile(workbook, `./output/${Names[i]}.xlsx`);
      var date = val[val.length - 1].Date.toString();
      date = date.split("-");
      var filename;
      if (val[val.length - 1]["No."]) {
        var filename = `./emails/${val[val.length - 1].CompanyName}_${
          val[val.length - 1]["No."]
        }_${Names[i]}.xlsx`;
      } else if (val[val.length - 1]["AC-No"]) {
        var filename = `./emails/${val[val.length - 1].CompanyName}_${
          val[val.length - 1]["AC-No"]
        }_${Names[i]}.xlsx`;
      } else {
        var filename = `./emails/${val[val.length - 1].CompanyName}_${
          val[val.length - 1]["AC-No."]
        }_${Names[i]}.xlsx`;
      }
      xlsx.writeFile(workbook, filename);
      i++;
    });
  } catch (error) {
    console.log(error.message);
  }
}

//manipulate sheet for penta3d and promech12
function manipulateSheet(file, fileType) {
  var workbook = xlsx.readFile(`./uploads/${file.originalname}`);
  var excelData = xlsx.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]]
  );

  var afterRemoveWeekend = [];

  let countDays = 0;
  for (let i = 0; i < excelData.length; i++) {
    var obj = Object(excelData[i]);
    Object.keys(obj).forEach((key) => {
      if (Date.parse(key)) {
        var date = new Date(key);

        if (date.getDay() == 5 || date.getDay() == 6) {
          delete obj[key];
        } else {
          countDays++;
          var value = String(obj[key]);
          obj[key] = value.slice(0, 11);
          // value=value.split(" ");
          //obj[key]=value;
          var clocks = String(obj[key]);
          var late = " ";
          var early = " ";
          clocks = clocks.split(" ");
          if (clocks[0] != "--:--") {
            late = calcLateTime(clocks[0]);
          }
          if (clocks[1] != "--:--") {
            early = calcEarlyTime(clocks[1]);
          }
          var date = new Date(key);

          var mom = moment(date).format("DD-MMM-YY");
          afterRemoveWeekend.push({
            "AC-No": obj["Employee ID"],
            Name: obj["Name"],
            Date: mom,
            "Clock In": clocks[0] == "--:--" ? " " : clocks[0],
            "Clock Out": clocks[1] == "--:--" ? " " : clocks[1],
            Late: late,
            Early: early,
            Absent: clocks[0] == "--:--" && clocks[1] == "--:--" ? "True" : "",
            Mission: "",
            Trans: "",
            CompanyName: fileType == "penta3d" ? "penta3d" : "promech12",
          });
        }
      }
    });
    totalDays = countDays;
    countDays = 0;
  }
  var newworkbook = xlsx.utils.book_new();
  var newsheet = xlsx.utils.json_to_sheet(afterRemoveWeekend);
  xlsx.utils.book_append_sheet(newworkbook, newsheet, "penta3d");
  xlsx.writeFile(newworkbook, `./output/${file.filename}`);
}

//calculate late time for penta3d and promech12
function calcLateTime(ClockIn) {
  var late = "";
  const attendtime = "08:40";
  start = attendtime.split(":");
  end = ClockIn.split(":");
  var startDate = new Date(0, 0, 0, start[0], start[1], 0);
  var endDate = new Date(0, 0, 0, end[0], end[1], 0);
  var diff = endDate.getTime() - startDate.getTime();

  if (diff > 0) {
    let hours = String(Math.floor(diff / 1000 / 60 / 60));
    diff -= hours * 1000 * 60 * 60;
    var minutes = String(Math.floor(diff / 1000 / 60));
    if (minutes.length == 1) {
      late = `0${hours}:0${minutes}`;
    } else {
      late = `0${hours}:${minutes}`;
    }
  }
  return late;
}
//calculate early time for penta3d and promech12

function calcEarlyTime(clockOut) {
  var early = "";
  const leaveTime = "4:30";
  start = leaveTime.split(":");
  end = clockOut.split(":");
  var startDate = new Date(0, 0, 0, start[0], start[1], 0);
  var endDate = new Date(0, 0, 0, end[0], end[1], 0);
  var diff = startDate.getTime() - endDate.getTime();

  if (diff > 0) {
    let hours = String(Math.floor(diff / 1000 / 60 / 60));
    diff -= hours * 1000 * 60 * 60;
    var minutes = String(Math.floor(diff / 1000 / 60));
    if (minutes.length == 1) {
      early = `0${hours}:0${minutes}`;
    } else {
      early = `0${hours}:${minutes}`;
    }
  }
  return early;
}

function changeDateRepresentation() {}

module.exports = { Promech, penta3d, promech12 };
