const mongoose  = require("mongoose")
const Schema = mongoose.Schema

const ObjectId = mongoose.Types.ObjectId

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  fullname: String
})

const adminSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  fullname: String
})

const courseSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  description:{
    type: String,
  },
  price: Number,
  imageURL: String,
  creatorId: {
    type: ObjectId,
     ref: "Admin"
  }
})

const purchaseSchema = new Schema({
  courseId: {
    type: ObjectId,
    ref: "Course",
    required: true
  },
  userId:{
    type: ObjectId,
    ref: "User",
    required: true
  },

})

const usermodel = mongoose.model("User",userSchema)
const adminmodel = mongoose.model("Admin",adminSchema)
const coursemodel = mongoose.model("Course",courseSchema)
const purchasemodel = mongoose.model("Purchase",purchaseSchema)

module.exports = {
  usermodel, adminmodel, coursemodel, purchasemodel
}
