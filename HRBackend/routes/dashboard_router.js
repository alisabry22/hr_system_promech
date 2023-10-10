const express=require("express");
const getDashboardData = require("../controllers/dashboard_controller");
const { verifyToken } = require("../helpers/auth_helpers");
const dashobard_router=express.Router();

//get dashboard data
dashobard_router.get("/dashboard",verifyToken,getDashboardData);

module.exports=dashobard_router;