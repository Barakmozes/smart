const express = require("express");
const path = require("path");
const http = require("http");
// מודול שיודע לפתור את בעיית האבטחת של הקורס
// שלא ניתן בברירת מחדל לשלוח מדומיין א' בקשה לדומיין ב
const cors = require("cors");
const db = require("./db/mongoConnect");

const { routesInit } = require("./routes/configRoutes");

const app = express();

// נותן אפשרות לכל דומיין לעשות בקשות לשרת שלנו (קריטי כדי ש-Netlify יוכל לדבר עם השרת הזה)
app.use(cors());

// מגדיר לשרת שהוא יכול לקבל מידע מסוג ג'ייסון בבאדי בבקשות שהם לא גט
app.use(express.json());

// דואג שתקיית פאבליק כל הקבצים בה יהיו חשופים לצד לקוח (עבור קבצים של השרת עצמו)
app.use(express.static(path.join(__dirname, "public")));

// פונקציה שמגדירה את כל הראוטים באפליקציית צד שרת שלנו
routesInit(app);

// הגדרת שרת עם יכולות אפ שמייצג את האקספרס
const server = http.createServer(app);

// משתנה שיגדיר על איזה פורט אנחנו נעבוד
// Render יספק PORT אוטומטית למשתנה סביבה, אחרת נעבוד על 5000 לוקאלי
let port = process.env.PORT || 5000;

// הפעלת השרת והאזנה לפורט המבוקש
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});