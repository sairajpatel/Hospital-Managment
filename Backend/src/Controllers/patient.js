const Patient = require('../models/Users/patient.js');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const doctorSchedule=require('../models/doctorSchedule.js');
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
const schedules=await doctorSchedule.find().populate('doctor','firstname lastname');
res.status(200).json({schedules});
   }
   catch(err){
    console.log(err);
   }
}