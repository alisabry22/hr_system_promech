const express=require("express");
const { AddNewJob, LoadAllJobs } = require("../controllers/jobs_controller");

const router=express.Router();


//get all jobs

router.get("/getalljobs",LoadAllJobs);

//add new jobs

router.post('/addnewjob',AddNewJob);

module.exports=router;