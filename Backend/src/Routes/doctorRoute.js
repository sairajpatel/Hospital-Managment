const express = require('express');
const { registerDoctor, loginDoctor, LogoutDoctor, doctorProfile, totaldoctor } = require('../Controllers/doctor');
const { authDoctor } = require('../Middlewares/authentication');
const { setDoctorSlots, getDoctorSchedule } = require('../Controllers/scheduleController');
const router = express.Router();

// Doctor auth routes
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/logout', authDoctor, LogoutDoctor);
router.get('/profile', authDoctor, doctorProfile);
router.get('/total', totaldoctor);

// Schedule routes
router.post('/doctorSchedule', authDoctor, setDoctorSlots);
router.get('/schedule', authDoctor, getDoctorSchedule);

module.exports = router;