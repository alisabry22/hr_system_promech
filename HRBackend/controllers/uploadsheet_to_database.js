const {
  UploadSheetsToDatabaseHelper,
  SubmitDataToAtTransTable,
} = require("../helpers/upload_sheets_helper");

const uploadSheetToDatabase = async (req, res) => {
  var files = req.files;

  try {
    if (files == undefined) {
      return res.send({ state: "error", message: "Please Add File" });
    }
    if (files.length != 3) {
      return res.send({
        state: "error",
        message: "You Must upload only 3 files",
      });
    }
    var result1 = await UploadSheetsToDatabaseHelper();
    if (result1) {
      await SubmitDataToAtTransTable();
    }

    return res.send({
      state: "success",
      message: "Successfully uploaded data",
    });
  } catch (error) {
    console.log(error);
    return res.send({ state: "error", message: error.message });
  }
};

module.exports = uploadSheetToDatabase;
