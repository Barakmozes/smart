const indexRouter = require("./index")

// app -> express עצמו
exports.routesInit = (app) => {
  app.use("/",); 

  // במקרה שהגענו לעמוד שלא קיים
  app.use((req,res) => {
    res.status(404).json({msg:"404 url page not found"})
  })
}

// להגדיר CORS-ORIGIN שיאפשר כניסה מכל דומיין
// או כל דומיין שנגדיר
exports.originCorsAccess = (app) => {
  app.all('*',  (req, res, next) => {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,x-auth-token');
    next();
  });
}