const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const admin = require('../models/Users/admin.js');
const JWT_SECRET=process.env.JWT_SECRET;
const {validationResult}=require('express-validator');

module.exports.LoginAdmin=async(req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const errorMessages=errors.array().map(error=>error.msg);
            req.flash('error',errorMessages.join(', '));
            return res.json({error:errorMessages});
            //add below code after creating admin login page.
            // return res.redirect('/admin/login')
           
        }
        
        let {email,password}=req.body;
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
        const payload = { id: findAdmin._id, role: findAdmin.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token',token);
        req.flash("success",`welcome ${findAdmin.name}`);
        //uncomment below code after creating admin dashboard.
      //   res.redirect('admin/dashboard');
          res.json({token,findAdmin});
      }
      
    }
    catch{
        req.flash('error','Something went wrong');
        // res.redirect('/admin/login');
    }


}
module.exports.LogoutAdmin=async (req,res)=>{
    try {
       
        req.flash('success', 'Successfully logged out');
    
        
        res.clearCookie('token');
         
        //   res.redirect('/admin');
        res.json("logout successfull")
        
      } catch (err) {
        console.error('Logout error:', err);
        res.redirect('/admin/login');
      }
}