const admin=require('../models/Users/admin');
const jwt =require('jsonwebtoken');
const blacklist=require('../models/blacklistToken');
const doctor=require('../models/Users/doctor');

module.exports.authAdmin = async (req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Unauthorized'});

    }
    const isBlacklist=await blacklist.findOne({token});
    if(isBlacklist){
        return res.status(401).json({message:"Unauthorized"});

    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const findbyadmin =await admin.findById(decoded._id);
        req.admin=findbyadmin;
        return next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({message:'Unauthorized'});
    }
}
module.exports.authDoctor=async(req,res,next)=>{
    const token=req.cookies.token||req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({"message":'Unauthorized'});
    }
    const isBlacklist=await blacklist.findOne({token});
    if(isBlacklist){
        return res.status(401).json({"message":"Unauthorized"});

    }
    try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const findbyDoctor=await doctor.findById(decoded._id);
    req.doctor=findbyDoctor;
    return next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({message:'Unauthorized'});

    }
}
