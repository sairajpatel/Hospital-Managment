const {loginDoctor,LogoutDoctor}=require('../Controllers/doctor');
const express=require('express');
const {body}= require('express-validator');
const authMiddleware=require('../Middlewares/authentication');
const route=express.Router();
route.post('/login',[
    body("email").isEmail().withMessage("Please enter valid email"),
    
],loginDoctor);
route.get('/logout',LogoutDoctor)

module.exports=route;