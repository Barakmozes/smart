const express= require("express");
const router = express.Router();

router.get('/', function(req, res, next) {
    app.get("indexRouter", function (_, res) {
        res.sendFile(
          path.join(__dirname, "./client/build/index.html"),
          function (err) {
            res.status(500).send(err);
          }
        );
      });
  });


module.exports = router;