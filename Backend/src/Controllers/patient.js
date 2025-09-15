const Patient = require('../models/Users/patient.js');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const Appointment=require('../models/appointment.js');
const DoctorSchedule=require('../models/doctorSchedule.js');
module.exports.registerByReceptionist = async (req, res) => {
  try {
    const {
      name, country, state, city, street, pincode, flatno,
      email, phone, age, gender
    } = req.body;

    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Patient already exists' });
    }

    const patient = await Patient.create({
      name, country, state, city, street, pincode, flatno,
      email, phone, age, gender,
      registrationStep: 'basic',
      createdBy: 'Receptionist'
    });

    res.status(200).json({
      message: 'Patient basic details registered successfully.',
      patient
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports.completeRegistrationByPatient = async (req, res) => {
    try {
      const { email, password, bloodgroup, allergies, Symptoms } = req.body;
  
      const patient = await Patient.findOne({ email });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      if (patient.registrationStep === 'complete') {
        return res.status(400).json({ message: 'Profile already completed' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      patient.password = hashedPassword;
      patient.bloodgroup = bloodgroup;
      patient.allergies = allergies;
      patient.Symptoms = Symptoms;
      patient.registrationStep = 'complete';
      patient.verified = true;
  
      await patient.save();
  
      res.status(200).json({ message: 'Registration completed successfully' });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
module.exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email }).select('+password');
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const isComplete = patient.registrationStep === 'complete';
    if (!isComplete) {
      return res.status(400).json({ message: "Patient not completed registration" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, patient.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const payload = {
      _id: patient._id,
      role: 'patient',
      name: patient.name,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Set cookie with secure options
    res.cookie('token', token, {
           httpOnly: true,
            secure: false, // for HTTPS
            sameSite: 'lax', // for cross-origin
            maxAge: 3600000 // 1 hour
    });

    // Send token in response along with user data
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: patient._id,
        role: 'patient',
        name: patient.name
      }
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.getPatientProfile = async (req, res) => {
  res.status(200).json({ patient: req.patient });
};
module.exports.logOutPatient=async(req,res)=>{
      try{
        res.clearCookie('token');
        res.status(200).json({message:"Logged out successfully"});
      }
      catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error"});
      }
}
module.exports.doctorSchedule=async(req,res)=>{
   try{
const schedules=await DoctorSchedule.find().populate('doctor','firstname lastname');
res.status(200).json({schedules});
   }
   catch(err){
    console.log(err);
   }
}
module.exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, appointmentType, notes } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'doctorId, date, and time are required' });
    }

    // Build the date object for storing in DB
    const appointmentDateObj = new Date(`${date} ${time}`);
    if (isNaN(appointmentDateObj)) {
      return res.status(400).json({ message: 'Invalid date or time format' });
    }

    // find doctor schedule
    const doctorSchedule = await DoctorSchedule.findOne({ doctor: doctorId });
    if (!doctorSchedule) {
      return res.status(404).json({ message: 'Doctor schedule not found' });
    }

    // compare only the date portion
    const incomingDay = date; // already string yyyy-mm-dd
    const dayBlock = doctorSchedule.availableSlots.find(slot =>
      slot.date &&
      slot.date.toISOString().split('T')[0] === incomingDay
    );

    // match time string exactly as stored in DB
    const timeString = time.trim().toUpperCase();

    if (!dayBlock || !dayBlock.slots.includes(timeString)) {
      return res.status(400).json({ message: 'Selected slot not available' });
    }

    // check if appointment already exists
    const existing = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: appointmentDateObj,
      status: { $in: ['pending', 'scheduled'] }
    });
    if (existing) {
      return res.status(400).json({ message: 'Slot already taken' });
    }

    // create appointment
    const appointment = await Appointment.create({
      patient: req.patient._id,
      doctor: doctorId,
      appointmentDate: appointmentDateObj,
      appointmentType,
      notes,
      status: 'pending'
    });

    // remove booked slot from doctor schedule
    dayBlock.slots = dayBlock.slots.filter(s => s !== timeString);
    await doctorSchedule.save();

    res.status(201).json({
      message: 'Appointment request submitted (pending approval)',
      appointment
    });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ message: 'Error booking appointment' });
  }
};

