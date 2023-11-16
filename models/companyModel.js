const mongoose = require("mongoose");
const Joi = require("joi")

//  chatGpt
let companySchema = new mongoose.Schema({
  name: String,
  company_id: Number,
  CategoryDescription: String
})

exports.CompanyModel = mongoose.model("companies", companySchema);

exports.validateCompany = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(1).max(150).required(),
    company_id: Joi.number().min(1).max(9999).required(),
    CategoryDescription: Joi.string().min(1).max(300).required(),
  })
  return joiSchema.validate(_reqBody)
}