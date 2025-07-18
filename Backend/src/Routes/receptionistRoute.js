const {loginReceptionist,totalReceptionist,LogoutReceptionist,getReceptionsitProfile}=require('../Controllers/receptionsist');
const express=require('express');
const {body}=require('express-validator');
const authMiddleware=require('../Middlewares/authentication');
const route=express.Router();
route.post('/login',[
    body("email").isEmail().withMessage("Please Enter valid email")
   
],loginReceptionist);

route.get('/logout',LogoutReceptionist);
route.get('/profile',authMiddleware.authReceptionist,getReceptionsitProfile);
route.get('/total-receptionist',totalReceptionist)
module.exports=route;