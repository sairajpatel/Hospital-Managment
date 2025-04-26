
import mongoose from 'mongoose';
const patientSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        enum:['USA','CAN']
    },
    state:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    street:{
        type:String,
        required:true,
    },
    pincode:{
        type:String,
        required:true,
    },
    flatno:{
        type:String,
        required:true,
    },
    bloodgroup:{
        type:String,
        enum:['A+','A-','B+','B-','O+','O-','AB+','AB-'],
        required:true,
    },
    allergies:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    age:{
    type:Number,
    required:true
    },
    gender:{
        type:String,
        required:true,
        enum:['Male','Female','Other'],
    },
    Symptoms:{
        type:String,
        required:true, 
    }
    
 
},

    {
        timestamps:true,
    }
)
export const Patient=mongoose.model('Patient',patientSchema);