const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  Name:String,
  Description:String,
  Link:String,
  company_id:String,//CategoryID מפתח זר
  ImageURL:String,
  Weight:String,
  Size:String,
  Price:Number,
  Discount:Number,
  AvailabilityStatus:String,
  date_created:{
    type:Date, default:Date.now
  }
})
exports.DeviceModel = mongoose.model("devices", schema)

exports.validateDevice = (_reqBody) => {
  let joiSchema = Joi.object({
    Name:Joi.string().min(2).max(406).required(),
    Description:Joi.string().min(2).max(406).required(),
    Link:Joi.string().min(2).max(406).required(),
    company_id:Joi.number().min(2).max(400).required(),//CategoryID
    ImageURL:Joi.string().min(2).max(999).allow(null, ""),
    Weight:Joi.string().min(2).max(400).required(),
    Size:Joi.string().min(2).max(400).required(),
    Price:Joi.number().min(1).max(999).required(),
    Discount:Joi.number().min(1).max(999).required(),
    AvailabilityStatus:Joi.string().min(2).max(400).required(),
    })
  return joiSchema.validate(_reqBody)
}