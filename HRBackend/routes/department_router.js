const express=require("express");
const {getAllDepartments,AddNewDepartment, DeleteDepartments} = require("../controllers/department_controller");
const { verifyToken } = require("../helpers/auth_helpers");
const deptrouter=express.Router();


//get All Departments
deptrouter.get("/getalldepts",verifyToken,getAllDepartments);
//add new department to oracle db
deptrouter.post("/addnewdept",verifyToken,AddNewDepartment);

deptrouter.post("/deletedepts",verifyToken,DeleteDepartments);

module.exports=deptrouter;