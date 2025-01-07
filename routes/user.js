const { Router } = require("express")
const {usermodel} = require("../db")
const userRouter = Router()
const bcrypt = require("bcrypt")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const userMiddleware = require("../middleware/user")

userRouter.post("/signup", async (req,res)=>{
 
  const {email, password, fullname} = req.body;
  
  try{
    const user = await usermodel.findOne({email})
    const hashedpwd = await bcrypt.hash(password,10)
   
    if(user){
      res.status(403).json({
        message: "User already exists! Please login"
      })
    }
    
      const newUser = await usermodel.create({email:email, password: hashedpwd, fullname: fullname})
   
      res.json({
        message: "you are signed up"
      })
  }
  catch(err){
    console.log("Error while signing up",err);
    res.status(500).json({ message: 'Error creating user', err })
  }
  
})

userRouter.post("/signin", async(req,res)=>{
  const {email, password} = req.body;

  try{
    const user = await usermodel.findOne({email});
    if(!user){
      res.status(404).json({
        message: "User doesnot exist, Please signup first"
      })
    }
    const isCorrectPwd = await bcrypt.compare(password, user.password)

    const token = jwt.sign({id: user._id},process.env.SECRET, {expiresIn: '5h'})

    if(isCorrectPwd){
      res.status(200).json({
        message: "signed in successfully",token
      })
    }else{
      res.status(401).json({
        message: "Incorrect password"
      })
    }

  } catch(err){
    res.status(500).json({
      message: "error while signing in", err
    })
  }
})

userRouter.get("/purchases",userMiddleware, (req,res)=>{
  res.json({
    message: "all purchased courses"
  })
})

module.exports = userRouter