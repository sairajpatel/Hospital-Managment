const express=require('express');
const route=express.Router();
const {body}=require('express-validator');
const {LoginAdmin}=require('../Controllers/authentication');
const {LogoutAdmin}=require('../Controllers/authentication');

route.get('/', (req, res) => {
    // add it after admin login page creation.add it after admin login page creation.
    // res.render('admin')
  });
route.post("/login",[
  body("email").isEmail().withMessage("Please enter a valid email"),
  body('password').isLength({min:6}).withMessage('Password must be 6 charaters')
],LoginAdmin);
route.get("/login", (req, res) => {
    // add it after admin login page creation.
    // res.render('/login')
  });
route.get("/logout",LogoutAdmin);
module.exports=route;