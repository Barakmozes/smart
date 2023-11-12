const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secrets");

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  date_created:{
    type:Date, default:Date.now
  },
  // role -> אם המשתמש הוא יוזר רגיל או אדמין
  role:{
    type:String, default:"user"
  }
})


exports.UserModel = mongoose.model("users",userSchema);

// פונקציה שמייצרת טוקן שמכיל את האיי די של המשתמש
// תקף ל 10 שעות
exports.createToken = (user_id,role) => {
  let token = jwt.sign({_id:user_id,role:role},config.token_secret,{expiresIn:"600mins"})
  return token;
}

// עושה בדיקה בצד שרת אם המידע תקין
// לפני ששולח לצד של המסד
exports.validateUser = (_reqBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(150).required(),
    email:Joi.string().min(2).max(150).email().required(),
    password:Joi.string().min(3).max(150).required()
  })
  return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email:Joi.string().min(2).max(150).email().required(),
    password:Joi.string().min(3).max(150).required()
  })
  return joiSchema.validate(_reqBody);
}