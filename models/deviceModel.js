const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  name: String,
  company_id: Number,
  battery_score: Number,
  camera_score: Number,
  price: Number,
  user_id:String,
  img_url:String,
  date_created:{
    type:Date, default:Date.now
  }
})
exports.DeviceModel = mongoose.model("devices", schema)

exports.validateDevice = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(400).required(),
    company_id: Joi.number().min(1).max(9999).required(),
    battery_score: Joi.number().min(1).max(100).required(),
    camera_score: Joi.number().min(1).max(999).required(),
    price: Joi.number().min(1).max(9999).required(),
    img_url: Joi.string().min(1).max(400).allow(null,""),
  })
  return joiSchema.validate(_reqBody)
}