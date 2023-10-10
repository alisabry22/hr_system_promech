const express=require("express");
const { loginController } = require("../controllers/auth_controller");
const authRouter=express.Router();


authRouter.post("/login",loginController);

module.exports=authRouter;