const DoctorSchedule=require('../models/doctorSchedule');

exports.setDoctorSlots = async (req, res) => {
  try {


    const { availableSlots } = req.body;

    if (!availableSlots || !Array.isArray(availableSlots)) {
      return res.status(400).json({ message: 'availableSlots array is required' });
    }

    const doctorId = req.doctor?._id || req.body.doctorId; // fallback if you pass doctorId in body

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID not provided' });
    }

    // Map date strings to Date objects to match schema
    const formattedSlots = availableSlots.map(slot => ({
      day: slot.day,
      date: slot.date ? new Date(slot.date) : undefined,
      slots: slot.slots
    }));

    const updatedSchedule = await DoctorSchedule.findOneAndUpdate(
      { doctor: doctorId },
      { $set: { availableSlots: formattedSlots } },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Slots updated successfully',
      data: updatedSchedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating slots', error: error.message });
  }
};


exports.getDoctorSchedule = async (req, res) => {
    try {
        const doctorId = req.doctor._id;
        const doctorSlots = await DoctorSchedule.findOne({ doctor: doctorId });
        res.status(200).json({ doctorSlots: doctorSlots || { availableSlots: [] } });
    } catch (error) {
        res.status(500).json({ message: "Error fetching slots" });
        console.log(error);
    }
};

exports.getAvailableSlots=async(req,res)=>{
    try{
        const {doctorId,day}=req.body;
        const doctorSlots=await DoctorSchedule.findOne({doctor:doctorId});
        const daySlots=doctorSlots.availableSlots.find(slot=>slot.day===day);
        res.status(200).json({doctorSlots})
        
    }
    catch(err){
        res.status(500).json({message:"Error fetching slots"});
    }
}