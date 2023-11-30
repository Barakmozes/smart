const express= require("express");
const router = express.Router();

// router.get("/", async(req,res) => {
//   res.json({msg:"Api Work 200"});
// })
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });

module.exports = router;