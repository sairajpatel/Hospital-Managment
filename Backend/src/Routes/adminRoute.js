const express=require('express');
const route=express.Router();
const {body}=require('express-validator');
const authMiddleware=require('../Middlewares/authentication');
const {LoginAdmin,LogoutAdmin,getAdminProfile}=require('../Controllers/authentication');
const {registerDoctor}=require('../Controllers/doctor');
const {registerReceptionist}=require('../Controllers/receptionsist');
route.get('/', (req, res) => {
    // add it after admin login page creation.add it after admin login page creation.
    // res.render('admin')
  });
  
route.post("/login",[
  body("email").isEmail().withMessage("Please enter a valid email"),
  body('password').isLength({min:6}).withMessage('Password must be 6 charaters')
],LoginAdmin);

route.post("/add-receptionist", [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
], authMiddleware.authAdmin, registerReceptionist);
  route.post('/add-doctor',[
    body("email").isEmail().withMessage("Please enter valid email"),
    body('password').isLength({min:6}).withMessage('Password must be 6 characters'),
  
  ],authMiddleware.authAdmin,registerDoctor);
route.get("/logout",LogoutAdmin);
route.get("/profile",authMiddleware.authAdmin,getAdminProfile);
module.exports=route;