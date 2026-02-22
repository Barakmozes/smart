const mongoose = require("mongoose");
const { config } = require("../config/secrets");

mongoose.set("strictQuery", false);

const URI = `mongodb+srv://${config.db_user}:${config.db_pass}@mozesdatab.26qfwhe.mongodb.net/dolci`;

mongoose
  .connect(URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅  MongoDB connected successfully."))
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1); // crash immediately instead of silently serving broken responses
  });

module.exports = mongoose.connection;
