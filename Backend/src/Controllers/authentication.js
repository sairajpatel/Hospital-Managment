const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const admin = require('../models/Users/admin.js');
const JWT_SECRET=process.env.JWT_SECRET;

module.exports.LoginAdmin=async(req,res)=>{
    try{
        let {email,password}=req.body;
        let findAdmin=await admin.findOne({email});
        if(!findAdmin){
            req.flash('error','Something went wrong');
            
        }
      const isMatch= await bcrypt.compare(password,findAdmin.password)
      if(!isMatch){
        req.flash('error', 'Incorrect password');
      return res.redirect('/admin/login');
      }
      const payload = { id: findAdmin._id, role: findAdmin.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      req.session.token = token;
      req.flash("success",`welcome ${findAdmin.name}`);
      //uncomment below code after creating admin dashboard.
    //   res.redirect('admin/dashboard');
        res.json("Login successfull")
    }
    catch{
        req.flash('error','Something went wrong');
        res.redirect('/admin/login');
    }


}
module.exports.LogoutAdmin=async (req,res)=>{
    try {
       
        req.flash('success', 'Successfully logged out');
    
        
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
            req.flash('error', 'Could not log out, please try again.');
            return res.redirect('/admin/dashboard');
          }
          //uncomment below code after creation of login page
         
        //   res.redirect('/admin');
        res.json("logout successfull")
        });
      } catch (err) {
        console.error('Logout error:', err);
        res.redirect('/admin/login');
      }
}