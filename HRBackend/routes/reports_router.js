const express=require("express");
const { GetAllTimeRepoData } = require("../controllers/reports_controller");
const { verifyToken } = require("../helpers/auth_helpers");
const router=express.Router();

router.get('/timerepo',verifyToken,GetAllTimeRepoData);


module.exports=router;