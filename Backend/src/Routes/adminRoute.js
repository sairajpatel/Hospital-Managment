const express=require('express');
const route=express.Router();
const {LoginAdmin}=require('../Controllers/authentication');
const {LogoutAdmin}=require('../Controllers/authentication');

route.get('/', (req, res) => {
    // add it after admin login page creation.add it after admin login page creation.
    // res.render('admin')
  });
route.post("/login",LoginAdmin);
route.get("/logout",LogoutAdmin);
module.exports=route;