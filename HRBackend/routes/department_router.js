const express=require("express");
const {getAllDepartments,AddNewDepartment, DeleteDepartments} = require("../controllers/department_controller");
const deptrouter=express.Router();


//get All Departments
deptrouter.get("/getalldepts",getAllDepartments);
//add new department to oracle db
deptrouter.post("/addnewdept",AddNewDepartment);

deptrouter.post("/deletedepts",DeleteDepartments);

module.exports=deptrouter;