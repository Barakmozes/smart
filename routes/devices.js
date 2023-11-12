const express = require("express");
const { DeviceModel, validateDevice } = require("../models/deviceModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {

  // Math.min -> מביא את המספר הקטן יותר מבין 2 המספרים של ה 20 ומספר העמוד
  let perPage = Math.min(req.query.perPage, 20) || 10;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await DeviceModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.get("/count", async(req,res) => {
  try{
    const perPage = req.query.perPage || 10
    const count = await DeviceModel.countDocuments({})
    res.json({count,pages:Math.ceil(count/perPage)});
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


router.get("/single/:id", async (req, res) => {
  try {
    const id = req.params.id
    let data = await DeviceModel.findOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/", auth, async (req, res) => {
  let validBody = validateDevice(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let device = new DeviceModel(req.body);
    device.user_id = req.tokenData._id;
    await device.save();
    res.json(device)
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.put("/:id", auth, async (req, res) => {
  let validBody = validateDevice(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data;
    if (req.tokenData.role == "admin") {
      data = await DeviceModel.updateOne({ _id: id }, req.body)
    }
    else {
      data = await DeviceModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body)
    }
    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.delete("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    let data;
    if (req.tokenData.role == "admin") {
      data = await DeviceModel.deleteOne({ _id: id }, req.body)
    }
    else {
      data = await DeviceModel.deleteOne({ _id: id, user_id: req.tokenData._id }, req.body)
    }
    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

module.exports = router;