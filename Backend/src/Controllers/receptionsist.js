const receptionistModel = require('../models/Users/receptionist');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const blacklistToken = require('../models/blacklistToken');
const JWT_SECRET = process.env.JWT_SECRET;
const Appointment=require('../models/appointment');
const DoctorSchedule = require('../models/doctorSchedule');
const appointment = require('../models/appointment');

require('dotenv').config();

module.exports.registerReceptionist = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstname,
      lastname,
      email,
      password,
      phone,
      country,
      state,
      city,
      street,
      flatno,
      pincode,
    } = req.body;

    const exists = await receptionistModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Receptionist already added' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const receptionistCreate = await receptionistModel.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      country,
      state,
      city,
      street,
      flatno,
      pincode,
      role: 'receptionist',
    });

    return res.status(200).json({ message: 'Receptionist added successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Something went wrong!' });
  }
};

module.exports.loginReceptionist = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const findReceptionist = await receptionistModel.findOne({ email });
    if (!findReceptionist) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const isMatch = await bcrypt.compare(password, findReceptionist.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const payload = {
      _id: findReceptionist.id,
      role: findReceptionist.role,
      name: findReceptionist.firstname,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token);
    return res.status(200).json({ message: 'Successfully logged in' });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

module.exports.LogoutReceptionist = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistToken.create({ token });
    res.clearCookie('token');
    res.json('Logout successful');
  } catch (err) {
    console.error('Logout error', err);
    res.status(500).json({ message: 'Logout failed' });
  }
};

module.exports.totalReceptionist=async(req,res)=>{
  try{
   const totalReceptionist=await receptionistModel.countDocuments();
   return res.status(200).json({totalReceptionist});
  }
  catch(err){
    return res.status(400).json({message:'server error'});
  }
}
module.exports.getReceptionsitProfile=async(req,res)=>{
  res.status(200).json(req.receptionist);
}
module.exports.getPendingRequests=async(req,res)=>{
  try{
 const pendingAppointments=await Appointment.find({status:'pending'}).populate('patient','name email phone').populate('doctor','name specialty');
 if(!pendingAppointments){
  return res.status(200).json({message:'No pending appointments',appointments:[]});
 }
 return res.status(200).json({
  message:'Pending appointments retrived successfully',
  appointments:pendingAppointments
 })
  }
  catch(error){
    console.error(error);

  }
}
module.exports.approveAppointment=async(req,res)=>{
try{
 const {AppointmentId}=req.body;
 const appointment=await Appointment.findById(AppointmentId);
 if(!appointment){
  return res.status(400).json({message:'Appointment not found'});

 }
 if(appointment.status!=='pending'){
  return res.status(400).json({message:'Appointment already processed'});

 }
 const doctorSchedule=await DoctorSchedule.findOne({
  doctor:appointment.doctor
 });
 const appointmentDateObj=appointment.appointmentDate;
 const timeString=appointmentDateObj.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});

 const dayBlock=doctorSchedule.availableSlots.find(slot=>slot.date&& slot.date.toISOString().split('T')[0]===appointmentDateObj.toISOString().split('T')[0]);
 if(dayBlock){
  dayBlock.slots=dayBlock.slots.filter(s=>s!==timeString);
  await doctorSchedule.save();
 }
 appointment.status='scheduled';
 await appointment.save();
 return res.json({message:'Appointment Approved',appointment});

}
catch(err){
console.error(err);
res.status(500).json({message:'Error Approving Appointment'});
}
}