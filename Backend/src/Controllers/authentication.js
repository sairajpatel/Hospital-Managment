const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const admin = require('../models/Users/admin.js');
const JWT_SECRET=process.env.JWT_SECRET;
const {validationResult}=require('express-validator');
const blacklist=require('../models/blacklistToken');
module.exports.LoginAdmin=async(req,res)=>{
    try{
        const errors=validationResult(req);
      if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
        
        let {email,password  }=req.body;
        let findAdmin=await admin.findOne({email});
        if(!findAdmin){
          req.flash('error', 'Admin not found');
          // return res.redirect('/admin/login')
          return res.status(400).json({"message":"Invalid email or password"});
            
        }
      const isMatch= await bcrypt.compare(password,findAdmin.password)
      if(!isMatch){
        req.flash('error', 'Incorrect password');
        return res.status(400).json({"message":"Invalid email or password"});

      // return res.redirect('/admin/login');
      }
      else{
        const payload = {_id: findAdmin._id, role: findAdmin.role,name:findAdmin.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token',token);
        req.flash("success",`welcome ${findAdmin.name}`);
        //uncomment below code after creating admin dashboard.
      //   res.redirect('admin/dashboard');
          return res.status(200).json({token,findAdmin});
      }
      
    }
    catch{
        req.flash('error','Something went wrong');
        // res.redirect('/admin/login');
    }


}
module.exports.LogoutAdmin=async (req,res)=>{
    try {
       const token=req.cookies.token|| req.headers.authorization?.split(' ')[1];
       await blacklist.create({token});
       
        req.flash('success', 'Successfully logged out');
    
        
        res.clearCookie('token');
         
        //   res.redirect('/admin');
        res.json("logout successfull")
        
      } catch (err) {
        console.error('Logout error:', err);
        res.redirect('/admin/login');
      }
}
module.exports.getAdminProfile=async(req,res)=>{
  res.status(200).json(req.admin);
}