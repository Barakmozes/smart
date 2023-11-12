// כל המשתנים המאובטחים יהיו מאוגדים בקובץ
// כגון שם משתמש של מסד, סיסמא של מסד ,וסיקריט טוקן
require("dotenv").config();
exports.config = {
  db_pass:process.env.DB_PASS,
  db_user:process.env.DB_USER,
  token_secret:process.env.TOKEN_SECRET
  // db_url:""
}