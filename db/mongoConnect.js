const mongoose = require('mongoose');
const {config} =require ('../config/secrets')
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${config.db_user}:${config.db_pass}@mozesdatab.26qfwhe.mongodb.net/smart`, {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    
console.log("mongo connected")
// we're connected!
});
module.exports = db;


