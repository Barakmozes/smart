const indexR = require("./index");
const usersR = require("./users");
const companiesR = require("./companies");
const devicesR = require("./devices");
// const autosR = require("./autos");


exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/companies",companiesR);
  app.use("/devices",devicesR);
  // app.use("/autos",autosR);
  app.use("*",(req,res) => {
    res.status(404).json({msg:"Page/endpoint not found, 404"})
  })
}