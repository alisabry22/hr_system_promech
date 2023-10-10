
const jwt=require("jsonwebtoken")
function getnewToken(userid){
    const token=jwt.sign({userid:userid},'promech');
    return token;
}



const verifyToken = (req, res, next) => {
    
  var token =req.headers.authorization;
   

  if (!token) {
     
    return res.status(403).send("A token is required for authentication");
  }
  try {
    if(token.toString().startsWith("Bearer ")){
        token=token.split("Bearer ")[1];
        const decoded = jwt.verify(token, "promech");
    req.user = decoded;
    }
    
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};


module.exports={getnewToken,verifyToken};