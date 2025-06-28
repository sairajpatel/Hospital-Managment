import React, { useState } from 'react';
import {
  TextField, Button, Typography, AppBar, Toolbar,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Grid,
  InputAdornment, IconButton, Paper, Avatar, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel, Select,
  MenuItem, FormHelperText
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../redux/slices/authSlice';

const drawerWidth = 280;

// Mock data - Replace with actual API calls
const mockPatients = [
  {
    id: 1,
    name: 'Chloe Harris',
    doctor: 'Dr. Smith',
    department: 'Cardiology',
    appointmentTime: '10:00 AM',
    contact: '+1 234-567-8900',
    status: 'Pending',
    avatar: 'CH',
    color: '#4CAF50' // Green color for the header
  },
  {
    id: 2,
    name: 'Noah Foster',
    doctor: 'Dr. Johnson',
    department: 'Neurology',
    appointmentTime: '11:30 AM',
    contact: '+1 234-567-8901',
    status: 'Confirmed',
    avatar: 'NF',
    color: '#FF5252' // Red gradient color
  },
  {
    id: 3,
    name: 'Emma Wilson',
    doctor: 'Dr. Davis',
    department: 'Orthopedics',
    appointmentTime: '2:30 PM',
    contact: '+1 234-567-8902',
    status: 'In Progress',
    avatar: 'EW',
    color: '#FF5252' // Red gradient color
  }
];

const todayAppointments = [
  { time: '09:00 AM', patient: 'John Doe', status: 'Completed', avatar: 'JD' },
  { time: '10:00 AM', patient: 'Chloe Harris', status: 'Waiting', avatar: 'CH' },
  { time: '11:30 AM', patient: 'Noah Foster', status: 'Scheduled', avatar: 'NF' }
];

const stats = [
  { title: 'Total Appointments', value: '45', color: '#3b82f6', icon: CalendarMonthIcon },
  { title: 'Pending Requests', value: '12', color: '#ef4444', icon: AssignmentTurnedInIcon },
  { title: "Today's Appointments", value: '8', color: '#22c55e', icon: AccessTimeIcon },
  { title: 'Registered Patients', value: '156', color: '#f59e0b', icon: PeopleIcon }
];

// Add this after the existing mock data
const departments = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Ophthalmology'
];

const doctors = {
  'Cardiology': ['Dr. Smith', 'Dr. Williams'],
  'Neurology': ['Dr. Johnson', 'Dr. Brown'],
  'Orthopedics': ['Dr. Davis', 'Dr. Miller'],
  'Pediatrics': ['Dr. Wilson', 'Dr. Moore'],
  'Dermatology': ['Dr. Taylor', 'Dr. Anderson'],
  'Ophthalmology': ['Dr. Thomas', 'Dr. Jackson']
};

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export default function ReceptionistDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState(mockPatients);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    doctor: '',
    appointmentTime: '',
    contact: '',
    status: '',
    notes: ''
  });

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(term.toLowerCase()) ||
      patient.contact.includes(term)
    );
    setPatients(filtered);
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Pending': { color: '#F4B400', bg: '#FFF8E1' },
      'Confirmed': { color: '#0F9D58', bg: '#E8F5E9' },
      'In Progress': { color: '#4285F4', bg: '#E3F2FD' }
    };
    return styles[status] || { color: '#757575', bg: '#F5F5F5' };
  };

  const getHeaderColor = (status) => {
    switch(status) {
      case 'Pending':
        return 'linear-gradient(90deg, #4CAF50 0%, #4CAF50 100%)';
      case 'Confirmed':
        return 'linear-gradient(90deg, #FF5252 0%, #FF7B31 100%)';
      case 'In Progress':
        return 'linear-gradient(90deg, #FF5252 0%, #FF7B31 100%)';
      default:
        return 'linear-gradient(90deg, #4CAF50 0%, #4CAF50 100%)';
    }
  };

  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)',
      'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      department: patient.department,
      doctor: patient.doctor,
      appointmentTime: patient.appointmentTime,
      contact: patient.contact,
      status: patient.status,
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
    setFormErrors({});
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update doctor list when department changes
    if (name === 'department') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        doctor: '' // Reset doctor when department changes
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.doctor) errors.doctor = 'Doctor is required';
    if (!formData.appointmentTime) errors.appointmentTime = 'Appointment time is required';
    if (!formData.contact.trim()) errors.contact = 'Contact is required';
    if (!formData.status) errors.status = 'Status is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/receptionist/logout`, {
        withCredentials: true,
      });
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would typically make an API call to update the patient
      const updatedPatients = patients.map(p => 
        p.id === selectedPatient.id ? { ...p, ...formData } : p
      );
      setPatients(updatedPatients);
      handleCloseDialog();
    }
  };

  const handleAddPatient = () => {
    navigate('/receptionist/add-patient');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e293b] text-white">
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-8">Receptionist Dashboard</h1>
          <nav className="space-y-4">
            <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <i className="ri-dashboard-line text-xl"></i>
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <i className="ri-user-line text-xl"></i>
              <span>Patients</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <i className="ri-calendar-line text-xl"></i>
              <span>Appointments</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <i className="ri-file-list-line text-xl"></i>
              <span>Reports</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">HealthFirst Clinic</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white">
                  S
                </div>
                <span className="text-gray-700">Sarah</span>
              </div>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
                <i className="ri-logout-box-line text-xl"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-6">
          {/* Search and Add Patient */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search patients by name or contact..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddPatient}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="ri-user-add-line"></i>
              <span>ADD PATIENT</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-calendar-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Total Appointments</h3>
              <p className="text-4xl font-semibold text-gray-900">45</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-time-line text-2xl text-rose-600"></i>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Pending Requests</h3>
              <p className="text-4xl font-semibold text-gray-900">12</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-calendar-check-line text-2xl text-emerald-600"></i>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Today's Appointments</h3>
              <p className="text-4xl font-semibold text-gray-900">8</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-user-line text-2xl text-amber-600"></i>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Registered Patients</h3>
              <p className="text-4xl font-semibold text-gray-900">156</p>
            </div>
          </div>

          {/* Today's Schedule */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Schedule</h2>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                  JD
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-500">09:00 AM</p>
                </div>
              </div>
              <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                Completed
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                  CH
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Chloe Harris</h3>
                  <p className="text-sm text-gray-500">10:00 AM</p>
                </div>
              </div>
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                Waiting
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                  NF
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Noah Foster</h3>
                  <p className="text-sm text-gray-500">11:30 AM</p>
                </div>
              </div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Scheduled
              </div>
            </div>
          </div>

          {/* Recent Patient Requests */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Patient Requests</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-medium">
                    CH
                  </div>
                  <h3 className="font-medium text-lg">Chloe Harris</h3>
                </div>
                <button className="px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-white/90 transition-colors font-medium">
                  MANAGE
                </button>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-white/70 text-sm mb-1">Doctor</p>
                  <p className="font-medium">Dr. Smith</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Department</p>
                  <p className="font-medium">Cardiology</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Appointment</p>
                  <p className="font-medium">10:00 AM</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Contact</p>
                  <p className="font-medium">+1 234-567-8900</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-medium">
                    NF
                  </div>
                  <h3 className="font-medium text-lg">Noah Foster</h3>
                </div>
                <button className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-white/90 transition-colors font-medium">
                  MANAGE
                </button>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-white/70 text-sm mb-1">Doctor</p>
                  <p className="font-medium">Dr. Johnson</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Department</p>
                  <p className="font-medium">Neurology</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Appointment</p>
                  <p className="font-medium">11:30 AM</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Contact</p>
                  <p className="font-medium">+1 234-567-8901</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-medium">
                    EW
                  </div>
                  <h3 className="font-medium text-lg">Emma Wilson</h3>
                </div>
                <button className="px-4 py-2 bg-white text-violet-700 rounded-lg hover:bg-white/90 transition-colors font-medium">
                  MANAGE
                </button>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-white/70 text-sm mb-1">Doctor</p>
                  <p className="font-medium">Dr. Davis</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Department</p>
                  <p className="font-medium">Orthopedics</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Appointment</p>
                  <p className="font-medium">2:30 PM</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Contact</p>
                  <p className="font-medium">+1 234-567-8902</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add this Dialog component before the closing Box tag */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2
        }}>
          <Avatar sx={{ bgcolor: 'white' }}>
            <Typography sx={{ color: 'primary.main' }}>
              {selectedPatient?.name?.split(' ').map(n => n[0]).join('')}
            </Typography>
          </Avatar>
          <Typography variant="h6" component="div">
            Manage Patient Details
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  label="Department"
                >
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
                {formErrors.department && (
                  <FormHelperText>{formErrors.department}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.doctor}>
                <InputLabel>Doctor</InputLabel>
                <Select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleFormChange}
                  label="Doctor"
                  disabled={!formData.department}
                >
                  {formData.department && doctors[formData.department].map(doc => (
                    <MenuItem key={doc} value={doc}>{doc}</MenuItem>
                  ))}
                </Select>
                {formErrors.doctor && (
                  <FormHelperText>{formErrors.doctor}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.appointmentTime}>
                <InputLabel>Appointment Time</InputLabel>
                <Select
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleFormChange}
                  label="Appointment Time"
                >
                  {timeSlots.map(time => (
                    <MenuItem key={time} value={time}>{time}</MenuItem>
                  ))}
                </Select>
                {formErrors.appointmentTime && (
                  <FormHelperText>{formErrors.appointmentTime}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  label="Status"
                >
                  {['Pending', 'Confirmed', 'In Progress', 'Completed'].map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
                {formErrors.status && (
                  <FormHelperText>{formErrors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contact"
                value={formData.contact}
                onChange={handleFormChange}
                error={!!formErrors.contact}
                helperText={formErrors.contact}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                multiline
                rows={4}
                placeholder="Add any additional notes about the patient..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
