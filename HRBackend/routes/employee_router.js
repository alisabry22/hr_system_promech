const express=require("express");
const router=express.Router();
const {getAllEmployees, addNewEmployee,getAllEmpTime, EditEmployee, EditEmpTime}=require("../controllers/employee_controller");
const { verifyToken } = require("../helpers/auth_helpers");

//get All Employee Page
router.get("/getallemp",verifyToken,getAllEmployees);


//add new employee
router.post("/addemp",verifyToken,addNewEmployee);
//get all employee time
router.get("/getemptime",verifyToken,getAllEmpTime);
router.post("/editemp",verifyToken,EditEmployee);
router.post("/editEmpTime",verifyToken,EditEmpTime);

module.exports=router;

