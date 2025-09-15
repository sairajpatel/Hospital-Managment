const mongoose=require('mongoose');
const doctorSlotSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  availableSlots: [{
  
    date:Date,
    slots: [{
      type: String  
    }]
  }]
});
module.exports=mongoose.model('doctorSchedule',doctorSlotSchema);