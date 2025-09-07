const {registerByReceptionist,completeRegistrationByPatient,loginPatient,getPatientProfile,logOutPatient, doctorSchedule}=require('../Controllers/patient');
const express=require('express');

const {authPatient}=require('../Middlewares/authentication');
const route = express.Router();

route.post('/reception-register', registerByReceptionist);
route.put('/complete-registration', completeRegistrationByPatient);
route.post('/login',loginPatient);
route.get('/profile',authPatient,getPatientProfile);
route.get('/doctorschedule',authPatient,doctorSchedule);
route.get('/logout',authPatient,logOutPatient);
module.exports = route;
