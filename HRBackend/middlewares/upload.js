const  multer=require("multer");
const PATH="./sql";
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

module.exports=upload;