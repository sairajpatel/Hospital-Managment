import mongoose from 'mongoose';
const addressSchema=new mongoose.Schema({
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
    }
})
export const Address=mongoose.model('Address',addressSchema);