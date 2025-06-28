const mongoose=require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, enum: ['USA', 'CAN'], required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  pincode: { type: String, required: true },
  flatno: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },

  // To be filled by patient
  password: { type: String, select: false },
  bloodgroup: { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'] },
  allergies: { type: String },
  Symptoms: { type: String },

  // Registration management
  status: { type: String, enum: ['Pending', 'Confirmed', 'In Progress'], default: 'Pending' },
  verified: { type: Boolean, default: false },
  registrationStep: { type: String, enum: ['basic', 'complete'], default: 'basic' },

  createdBy: { type: String, enum: ['Receptionist', 'Patient'], default: 'Receptionist' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);