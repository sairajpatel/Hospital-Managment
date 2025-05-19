import mongoose from 'mongoose';
const nurseSchema= new mongoose.Schema({
name:{
    type:String,
    requried:true,
},
patient:{
    type:Schema.Types.ObjectId,
    ref:'Patient',
   
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

})
export const Nurse = mongoose.model('Nurse', nurseSchema);