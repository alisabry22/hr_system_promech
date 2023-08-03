const express=require("express");
const router=express.Router();
const  multer=require("multer");
const PATH="./uploads";
const uploadToDatabase=require("../middlewares/upload");
const {Promech,promech12, penta3d}=require("../controllers/upload_controller")
const bodyparser=require("body-parser");
const uploadSheetToDatabase = require("../controllers/uploadsheet_to_database");
router.use(bodyparser.urlencoded({extended:false}));
let storage=multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,PATH);
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

let upload=multer({
    storage:storage
});
router.post("/uploadsheet",uploadToDatabase.array("uploadfile",3),uploadSheetToDatabase);
   
// for uploading files from angular to node js 
router.post("/uploadfile",upload.single('file'),(req,res)=>{
   console.log(req.body);
    try {
        if(req.file==undefined|| !req.body.fileType){
            return res.send({state:"Error",message:"Please Fill all parts"});
            
        }

            if(req.body.fileType=="Promech"){
               
                Promech(req,res);
            }else if(req.body.fileType=="Penta3d"){
         
                
                penta3d(req,res);
            }else{
               
                console.log("promech12 called");

                promech12(req,res);
            }
           

        }

        
        
        
        
     catch (error) {
        
        return res.send({state:"Error",message:error});
    } 
  
    
});




module.exports=router;
