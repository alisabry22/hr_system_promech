const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  addNewEmployee,
  getAllEmpTime,
  EditEmployee,
  EditEmpTime,
  getEmpsHistory,
  sendEmailToEmployees,
  getAllEmailsFromDb,
} = require("../controllers/employee_controller");
const { verifyToken } = require("../helpers/auth_helpers");

//get All Employee Page
router.get("/getallemp", verifyToken, getAllEmployees);
//send mail to employee

router.post("/sendemail", verifyToken, sendEmailToEmployees);

//add new employee
router.post("/addemp", verifyToken, addNewEmployee);
//get all employee time
router.get("/getemptime", verifyToken, getAllEmpTime);
router.post("/editemp", verifyToken, EditEmployee);
router.post("/editEmpTime", verifyToken, EditEmpTime);
//get emps history
router.get("/emphistory", verifyToken, getEmpsHistory);

//get emails from db
router.get("/loademails", verifyToken, getAllEmailsFromDb);

module.exports = router;
