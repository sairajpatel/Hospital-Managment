import mongoose from 'mongoose';
const receptionistSchema=new mongoose.Schema({
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
    },
    patient:{
        type:Schema.Types.ObjectId,
        ref:'Patient',
    },
    doctor:{
        type:Schema.Types.ObjectId,
        ref:'Doctor',
    },
   
});
export const Receptionist = mongoose.model('Receptionist', receptionistSchema);
 