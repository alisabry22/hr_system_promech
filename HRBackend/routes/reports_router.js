const express=require("express");
const { GetAllTimeRepoData } = require("../controllers/reports_controller");
const router=express.Router();

router.get('/timerepo',GetAllTimeRepoData);


module.exports=router;