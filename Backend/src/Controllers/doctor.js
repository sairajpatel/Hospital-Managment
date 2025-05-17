const doctorModel=require('../models/Users/doctor');
const {validationResult}=require('express-validator');
const blacklistToken=require('../models/blacklistToken');
const bcryptpassword=require('bcrypt');
const JWT_SECRET=process.env.JWT_SECRET;
const jwt=require('jsonwebtoken');
module.exports.registerDoctor=async(req,res)=>{
    try{
         const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {name,email,password,phone,country,state,city,street,pincode,flatno,specialization,experience}=req.body;
    const exists=await doctorModel.findOne({email});
    if(exists){
        return res.status(400).json({message:"Doctor already added"});
    }
    const bcrypt=await bcryptpassword.hash(password,10); 
    const doctor=await doctorModel.create({
       name,
       email,
       password:bcrypt,
       phone,
       country,
       state,
       city,
       street,
       pincode,
       flatno,
       role:'doctor',
       specialization,
       experience


    });
   
    return res.status(200).json({mesaage:"Doctor added successfully"});

}
   
catch{
 res.status(400).json("something went wrong");
}
}   
module.exports.loginDoctor=async(req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});

        }
        let{email,password}=req.body;
        let findDoctor=await doctorModel.findOne({email});
        if(!findDoctor){
            return res.status(400).json({"mesaage":"Doctor not found!"});
        }
        const isMatch=await bcryptpassword.compare(password,findDoctor.password);
        if(!isMatch){
            return res.status(400).json({"message":"Invalid email or password"});
            
        }
        const payload={_id:findDoctor.id,role:findDoctor.role,name:findDoctor.role};
        const token=jwt.sign(payload,JWT_SECRET,{expiresIn:'1h'});
        res.cookie('token',token);
        return res.status(200).json({"message":"successfully login"});
    }
    catch(err){
     return res.status(400).json({"message":"something went wrong"});
    }
}
module.exports.LogoutDoctor=async(req,res)=>{
    try{
     const token=req.cookies.token||req.headers.authorization?.split(' ')[1];
     await blacklistToken.create({token});
     res.clearCookie('token');
     res.json("logout successfull")
    }
    catch(err){
     console.error('logout error',err);
    
    }
}