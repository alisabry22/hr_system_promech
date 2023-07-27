const express=require("express");
const getDashboardData = require("../controllers/dashboard_controller");
const dashobard_router=express.Router();

//get dashboard data
dashobard_router.get("/dashboard",getDashboardData);

module.exports=dashobard_router;