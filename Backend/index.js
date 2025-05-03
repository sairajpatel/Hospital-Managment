const express= require('express');
const dotenv= require('dotenv');
const app= express();
dotenv.config();
const session=require('express-session');
const flash=require('connect-flash');
const connectDB = require('./src/db/index.js');
const cookieParser=require('cookie-parser');
const admin=require('./src/Routes/adminRoute.js');
app.use(express.urlencoded({ extended: true })); // for form data (HTML forms)
app.use(express.json()); // for JSON data (like from Postman)
app.use(cookieParser());
connectDB();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.token = req.session.token || null; // token is available to all views
  next();
});

app.use('/admin', admin); 


  
app.listen(process.env.PORT, () => {
    console.log(`localhost:${process.env.PORT}`);
});
