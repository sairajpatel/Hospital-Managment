const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['doctor','receptionist','patient','nurse','admin'],
    }
});
module.exports = mongoose.model('Admin', adminSchema);