const jwt = require("jsonwebtoken")
require("dotenv").config()

function adminMiddleware(req,res,next){
  const token = req.headers.token;

  if(!token){
    res.status(401).json({
      message: "Access denied, no token provided"
    })
  }
  
  const decoded = jwt.verify(token,process.env.ADMIN_SECRET)

  if(decoded){
    req.userId = decoded.id 
    next()
  }else{
    res.status(403).json({
      message: "you are not signed in"
    })
  }
}
module.exports = adminMiddleware