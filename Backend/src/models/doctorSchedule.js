const mongoose=require('mongoose');
const doctorSlotSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  availableSlots: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    slots: [{
      type: String  
    }]
  }]
});
module.exports=mongoose.model('doctorSchedule',doctorSlotSchema);