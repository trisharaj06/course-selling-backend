const { Router } = require("express")
const {adminmodel} = require("../db")
const adminRouter = Router()
require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

adminRouter.post("/signup", async(req,res)=>{
  const {email, password, fullname} = req.body;

  try{
    const user = await adminmodel.findOne({email})

    if(user){
      res.status(403).json({
        message: "User already exists!, Please Login"
      })
    }

    const hashpwd = await bcrypt.hash(password,12);
    
    const createUser = await adminmodel.create({email, password: hashpwd, fullname})


    res.status(201).json({
      message: "User signed up successfully"
    })
  }catch(err){
    res.status(500).json({
      message: "Error while signing up", err
    })
  }
})

adminRouter.post("/signin", async(req,res)=>{
  const {email,password} = req.body;

  try{
    const admin = await adminmodel.findOne({email})
    if(!admin){
      res.status(404).json({
        message: "You are not signed up, please signup first"
      })
    }

      const checkpwd = await bcrypt.compare(password,admin.password);
      if(!checkpwd){
        res.status(401).json({
          message: "Incorrect password"
        })
      }

      const token = jwt.sign({id:admin._id},process.env.ADMIN_SECRET,{expiresIn: '5h'})

      res.json({
        message: "you are signed in", token
      })
    
  } catch(err){
    res.status(500).json({
      message: "Error while signing in", err
    })
  }
})

adminRouter.post("/course",(req,res)=>{
  
})

adminRouter.put("/course",(req,res)=>{
  
})

module.exports = adminRouter