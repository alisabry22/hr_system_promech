const express=require("express");
const router=express.Router();
const {getAllEmployees, addNewEmployee,getAllEmpTime, EditEmployee, EditEmpTime}=require("../controllers/employee_controller")

//get All Employee Page
router.get("/getallemp",getAllEmployees);


//add new employee
router.post("/addemp",addNewEmployee);
//get all employee time
router.get("/getemptime",getAllEmpTime);
router.post("/editemp",EditEmployee);
router.post("/editEmpTime",EditEmpTime);

module.exports=router;

