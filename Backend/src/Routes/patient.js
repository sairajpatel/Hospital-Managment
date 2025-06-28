const {registerByReceptionist,completeRegistrationByPatient}=require('../Controllers/patient');
const express=require('express');

const route = express.Router();

route.post('/reception-register', registerByReceptionist);
route.put('/complete-registration', completeRegistrationByPatient);
module.exports=route;
