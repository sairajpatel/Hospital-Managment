import mongoose from "mongoose";
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
    address:{
        type:Schema.Types.ObjectId,
        ref:Address,
    },
    role:{
        type:String,
        enum:['doctor','receptionist','patient','nurse','admin'],
    }
});