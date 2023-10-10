const express=require("express");
const { AddNewJob, LoadAllJobs } = require("../controllers/jobs_controller");
const { verifyToken } = require("../helpers/auth_helpers");

const router=express.Router();


//get all jobs

router.get("/getalljobs",verifyToken,LoadAllJobs);

//add new jobs

router.post('/addnewjob',verifyToken,AddNewJob);

module.exports=router;