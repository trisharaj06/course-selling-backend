const express = require("express")
const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");
const adminRouter = require("./routes/admin");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log("MongoDB connected!");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((err)=>{
  console.log("error in connecting with mongoDB",err);
  
})

app.use("/user",userRouter);
app.use("/course",courseRouter)
app.use("/admin",adminRouter)