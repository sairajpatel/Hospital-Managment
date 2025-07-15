const doctorModel=require('../models/Users/doctor');
const {validationResult}=require('express-validator');
const blacklistToken=require('../models/blacklistToken');
const bcryptpassword=require('bcrypt');
const JWT_SECRET=process.env.JWT_SECRET;
const jwt=require('jsonwebtoken');
const Appointment = require('../models/appointment');
module.exports.registerDoctor=async(req,res)=>{
    try{
         const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {firstname,lastname,email,password,phone,country,state,city,street,pincode,flatno,specialization,experience}=req.body;
    const exists=await doctorModel.findOne({email});
    if(exists){
        return res.status(400).json({message:"Doctor already added"});
    }
    const bcrypt=await bcryptpassword.hash(password,10); 
    const doctor=await doctorModel.create({
       firstname,
       lastname,
       email,
       password:bcrypt,
       phone,
       country,
       state,
       city,
       street,
       pincode,
       flatno,
       role:'doctor',
       specialization,
       experience


    });
   
    return res.status(200).json({mesaage:"Doctor added successfully"});

}
   
catch{
 res.status(400).json("something went wrong");
}
}   
module.exports.loginDoctor=async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // Find doctor and select password field
        const doctor = await doctorModel.findOne({ email }).select('+password');
        if (!doctor) {
            return res.status(404).json({
                status: 'error',
                message: 'Doctor not found'
            });
        }

        // Verify password
        const isPasswordValid = await bcryptpassword.compare(password, doctor.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Create token payload
        const payload = {
            _id: doctor._id,
            role: doctor.role,
            name: doctor.firstname
        };

        // Sign token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        
        // Set cookie with secure options
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // for HTTPS
            sameSite: 'none', // for cross-origin
            maxAge: 3600000 // 1 hour
        });
        
        // Send success response
        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token,
            user: {
                id: doctor._id,
                role: doctor.role,
                name: doctor.firstname,
                email: doctor.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}
module.exports.LogoutDoctor=async(req,res)=>{
    try{
     const token=req.cookies.token||req.headers.authorization?.split(' ')[1];
     await blacklistToken.create({token});
     res.clearCookie('token');
     res.json("logout successfull")
    }
    catch(err){
     console.error('logout error',err);
    
    }
}
module.exports.totaldoctor = async (req, res) => {
  try {
    const totaldoctor = await doctorModel.countDocuments();
    return res.status(200).json({ totaldoctor });
  } catch (err) {
    console.log('Error in fetching data:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
module.exports.doctorProfile=async(req,res)=>{
   await res.status(200).json(req.doctor);
}

// New endpoints for doctor dashboard
module.exports.getAppointmentStats = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalAppointments, pendingRequests, todayAppointments] = await Promise.all([
      Appointment.countDocuments({ doctor: doctorId }),
      Appointment.countDocuments({ doctor: doctorId, status: 'waiting' }),
      Appointment.countDocuments({
        doctor: doctorId,
        appointmentDate: { $gte: today, $lt: tomorrow }
      })
    ]);

    res.status(200).json({
      stats: {
        totalAppointments,
        pendingRequests,
        todayAppointments
      }
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    res.status(500).json({ message: 'Error fetching appointment stats' });
  }
};

module.exports.getAppointments = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: today, $lt: tomorrow }
    })
    .populate('patient', 'firstname lastname email')
    .sort({ appointmentDate: 1 });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

module.exports.getRecentRequests = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const requests = await Appointment.find({
      doctor: doctorId,
      status: 'waiting'
    })
    .populate('patient', 'firstname lastname email')
    .sort({ createdAt: -1 })
    .limit(5);

    res.status(200).json({ requests });
  } catch (error) {
    console.error('Error fetching recent requests:', error);
    res.status(500).json({ message: 'Error fetching recent requests' });
  }
};

module.exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const doctorId = req.doctor._id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment' });
  }
};