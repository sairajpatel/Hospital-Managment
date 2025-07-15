const DoctorSchedule=require('../models/doctorSchedule');

exports.setDoctorSlots=async(req,res)=>{
    try{
        const {availableSlots}=req.body;
        const doctorId=req.doctor._id;
        await DoctorSchedule.findOneAndUpdate(
            {doctor:doctorId},
            {availableSlots},
            {upsert:true}
        );
        res.status(200).json({message:"Slots updated successfully"});

    }
    catch(error){
        res.status(500).json({message:"Error updating slots"});
        console.log(error);
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