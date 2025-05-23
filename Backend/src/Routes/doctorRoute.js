const {loginDoctor,LogoutDoctor,totaldoctor,doctorProfile}=require('../Controllers/doctor');
const express=require('express');
const {body}= require('express-validator');
const authMiddleware=require('../Middlewares/authentication');
const route=express.Router();
route.post('/login',[
    body("email").isEmail().withMessage("Please enter valid email"),
    
],loginDoctor);
route.get('/logout',LogoutDoctor)
route.get('/total-doctor',totaldoctor)
route.get('/profile',authMiddleware.authDoctor,doctorProfile);
module.exports=route;