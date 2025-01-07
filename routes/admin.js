const { Router } = require("express")
const {adminmodel, coursemodel} = require("../db")
const adminRouter = Router()
require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const adminMiddleware = require("../middleware/admin")

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

adminRouter.post("/course",adminMiddleware, async(req,res)=>{
  const {title, description, price, imageURL} = req.body;

  const adminId = req.userId;

  const course = await coursemodel.create({
    title,description,price,imageURL,creatorId:adminId
  }) 

  res.status(201).json({
    message: "course created successfully"
  })
})

adminRouter.put("/course",adminMiddleware, async(req,res)=>{
  const {title, description, price, imageURL, courseId} = req.body;
  const adminId = re.userId

  const course = await coursemodel.updateOne({
    _id: courseId,
    creatorId: adminId
  },{
    title,description,price,imageURL
  }) 

  res.json({
    message: "course updated"
  })
})

adminRouter.get("/course/bulk", adminMiddleware, async(req,res)=>{
  const adminId = req.userId;

  const allCourses = await coursemodel.find({creatorId: adminId})

  res.json({
    allCourses
  })
})
module.exports = adminRouter